import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Insert email into allowed_testers (ignore duplicates)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error: insertError } = await supabase
      .from("allowed_testers")
      .upsert({ email: email.trim().toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to grant access");
    }

    // Send welcome email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f9f9f7; font-family: Georgia, 'Times New Roman', serif; }
    .container { max-width: 520px; margin: 0 auto; padding: 40px 24px; }
    .content { background-color: #ffffff; border-radius: 12px; padding: 40px 32px; }
    p { color: #3a3a3a; font-size: 15px; line-height: 1.75; margin: 0 0 16px 0; }
    ol { padding-left: 20px; margin: 16px 0; }
    ol li { color: #3a3a3a; font-size: 15px; line-height: 1.75; padding: 4px 0; }
    a { color: #709474; text-decoration: underline; }
    a:hover { color: #4a7a4f; }
    .sign-off { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e8e4; }
    .sign-off p { color: #709474; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hello,</p>

      <p>Thank you for your interest in SeeHere — your access is now live.</p>

      <p>Whenever you're ready, you can create your account and begin your first session at your own pace. There's no pressure to dive in straight away. SeeHere will be there when the moment feels right.</p>

      <p>To get started:</p>

      <ol>
        <li>Visit <a href="https://www.seehere.ai">www.seehere.ai</a></li>
        <li>Create your account using the log in button in the top right corner.</li>
        <li>Begin your first session — you have 2 free sessions to explore</li>
      </ol>

      <p>After your first 2 sessions, we'd gently ask that you take a few minutes to share your experience with us. Your feedback will directly shape how SeeHere grows, and we'd love to hear your honest thoughts — good or otherwise.Once we have received your feedback we will add 6 more free sessions to your account.</p>

      <p><a href="https://forms.gle/koT1ZR1bcUn8nnkX9">Share your feedback here</a></p>

      <p>Thank you for being one of our first. It means a great deal to us.</p>

      <p>Welcome to your quiet space,</p>

      <div class="sign-off">
        <p>— The SeeHere Team</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "See Here <hello@seehere.ai>",
        to: [email.trim()],
        subject: "Your See Here access is live",
        html: htmlBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
