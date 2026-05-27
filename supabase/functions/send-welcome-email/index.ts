const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

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
    .cta-wrap { text-align: center; margin: 28px 0 8px 0; }
    a.cta-button { display: inline-block; background-color: #709474; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; font-family: Georgia, 'Times New Roman', serif; }
    .sign-off { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e8e4; }
    .sign-off p { color: #709474; font-weight: 600; font-size: 14px; margin: 0 0 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hi,</p>

      <p>Welcome to SeeHere.</p>

      <p>We hope your first session felt like a safe space to talk.</p>

      <p>There's no pressure to rush back. But whenever something's on your mind &mdash; big or small &mdash; your space is here.</p>

      <p>Most people find that talking freely more often is when things start to shift. Not because anything is fixed, but because it gives you time to reflect on your thoughts and feelings.</p>

      <p>Your next session will be available after a short period of self-reflection.</p>

      <div class="cta-wrap">
        <a href="https://seehere.ai/auth" class="cta-button">Start your next session &rarr;</a>
      </div>

      <div class="sign-off">
        <p>Take care,</p>
        <p>The SeeHere Team</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'See Here <hello@seehere.ai>',
        to: [email],
        subject: 'Welcome to See Here',
        html: htmlBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
