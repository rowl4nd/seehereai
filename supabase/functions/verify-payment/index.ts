import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate the caller
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  const authenticatedUserId = claimsData.claims.sub;

  // Service role client for updating credits
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID required");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session — get user_id from metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ success: false, message: "Payment not completed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const userId = session.metadata?.user_id;
    const sessionsToAdd = parseInt(session.metadata?.sessions || "0");
    const amountPaid = session.amount_total || 0;
    const paymentIntentId = session.payment_intent as string;

    if (!userId || sessionsToAdd <= 0) {
      throw new Error("Missing required metadata in checkout session");
    }

    // Verify the authenticated user owns this payment session
    if (userId !== authenticatedUserId) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Idempotency check: see if this payment was already processed
    const { data: existingPurchase } = await supabaseAdmin
      .from("credit_purchases")
      .select("id")
      .eq("stripe_payment_id", paymentIntentId)
      .maybeSingle();

    if (existingPurchase) {
      return new Response(
        JSON.stringify({ success: true, message: "Already processed", sessions: sessionsToAdd }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get current credits
    const { data: currentCredits } = await supabaseAdmin
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single();

    const newBalance = (currentCredits?.balance || 0) + sessionsToAdd;

    // Update credits
    await supabaseAdmin
      .from("credits")
      .update({ balance: newBalance })
      .eq("user_id", userId);

    // Record purchase
    await supabaseAdmin.from("credit_purchases").insert({
      user_id: userId,
      sessions_purchased: sessionsToAdd,
      amount_paid: amountPaid,
      stripe_payment_id: paymentIntentId,
    });

    console.log(`Verified & credited ${sessionsToAdd} sessions for user ${userId}. New balance: ${newBalance}`);

    return new Response(
      JSON.stringify({ success: true, sessions: sessionsToAdd, newBalance }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(
      JSON.stringify({ error: "Payment verification failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
