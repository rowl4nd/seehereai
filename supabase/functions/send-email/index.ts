import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailHookPayload {
  user: {
    email: string;
    user_metadata?: {
      display_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

function confirmationEmail(email: string, confirmUrl: string): { subject: string; html: string } {
  return {
    subject: "Welcome to SeeHere — please verify your email",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f7f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:28px;font-weight:300;color:#1a1a1a;letter-spacing:-0.5px;">SeeHere</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#333333;">
                Welcome. We're glad you're here.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#333333;">
                Please verify your email address to get started. This link will expire in 24 hours.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${confirmUrl}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.3px;">
                Verify my email
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#999999;">
                If you didn't create an account with SeeHere, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#999999;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmUrl}" style="color:#666666;word-break:break-all;">${confirmUrl}</a>
              </p>
            </td>
          </tr>
        </table>
        <table width="480" cellpadding="0" cellspacing="0" style="padding:24px 40px;">
          <tr>
            <td align="center">
              <p style="margin:0;font-size:12px;color:#bbbbbb;font-family:Georgia,'Times New Roman',serif;">
                SeeHere — a space to reflect
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

function resetEmail(email: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset your SeeHere password",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f7f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:28px;font-weight:300;color:#1a1a1a;letter-spacing:-0.5px;">SeeHere</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#333333;">
                We received a request to reset your password. No worries — it happens.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#333333;">
                Click the button below to choose a new password. This link will expire in 1 hour.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${resetUrl}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.3px;">
                Reset my password
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#999999;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#999999;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color:#666666;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>
        </table>
        <table width="480" cellpadding="0" cellspacing="0" style="padding:24px 40px;">
          <tr>
            <td align="center">
              <p style="margin:0;font-size:12px;color:#bbbbbb;font-family:Georgia,'Times New Roman',serif;">
                SeeHere — a space to reflect
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: EmailHookPayload = await req.json();
    const { user, email_data } = payload;

    const emailType = email_data.email_action_type;
    const token = email_data.token_hash;
    const siteUrl = email_data.site_url || email_data.redirect_to;

    let emailContent: { subject: string; html: string };

    if (emailType === "signup" || emailType === "confirmation") {
      const confirmUrl = `${siteUrl}/auth/v1/verify?token=${token}&type=signup&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;
      emailContent = confirmationEmail(user.email, confirmUrl);
    } else if (emailType === "recovery" || emailType === "reset") {
      const resetUrl = `${siteUrl}/auth/v1/verify?token=${token}&type=recovery&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;
      emailContent = resetEmail(user.email, resetUrl);
    } else if (emailType === "magic_link") {
      const magicUrl = `${siteUrl}/auth/v1/verify?token=${token}&type=magiclink&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;
      emailContent = {
        subject: "Your SeeHere login link",
        html: confirmationEmail(user.email, magicUrl).html,
      };
    } else {
      console.log(`Unhandled email type: ${emailType}`);
      return new Response(JSON.stringify({ error: `Unhandled email type: ${emailType}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SeeHere <hello@seehere.ai>",
        to: [user.email],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", JSON.stringify(resData));
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(resData)}`);
    }

    console.log(`Email sent successfully via Resend: type=${emailType}, to=${user.email}, id=${resData.id}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
