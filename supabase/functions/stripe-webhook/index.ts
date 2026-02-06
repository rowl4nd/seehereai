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

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only handle checkout.session.completed
    if (event.type !== "checkout.session.completed") {
      return new Response(
        JSON.stringify({ received: true, message: "Event type not handled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Verify payment was successful
    if (session.payment_status !== "paid") {
      console.log("Payment not completed, skipping");
      return new Response(
        JSON.stringify({ received: true, message: "Payment not completed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = session.metadata?.user_id;
    const sessionsToAdd = parseInt(session.metadata?.sessions || "0");
    const paymentIntentId = session.payment_intent as string;

    if (!userId || sessionsToAdd <= 0) {
      console.error("Missing metadata:", { userId, sessionsToAdd });
      return new Response(
        JSON.stringify({ error: "Missing required metadata" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Idempotency check: see if this payment was already processed
    const { data: existingPurchase } = await supabaseAdmin
      .from("credit_purchases")
      .select("id")
      .eq("stripe_payment_id", paymentIntentId)
      .maybeSingle();

    if (existingPurchase) {
      console.log("Payment already processed:", paymentIntentId);
      return new Response(
        JSON.stringify({ received: true, message: "Already processed" }),
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
      amount_paid: session.amount_total || 0,
      stripe_payment_id: paymentIntentId,
    });

    console.log(`Successfully added ${sessionsToAdd} credits for user ${userId}. New balance: ${newBalance}`);

    return new Response(
      JSON.stringify({ received: true, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
