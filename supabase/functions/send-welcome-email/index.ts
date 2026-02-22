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
    .section-heading { color: #3a3a3a; font-size: 16px; font-weight: 700; margin: 28px 0 8px 0; }
    a.feedback-link { color: #709474; font-weight: 600; text-decoration: underline; }
    .sign-off { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e8e4; }
    .sign-off p { color: #709474; font-weight: 600; font-size: 14px; margin: 0 0 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hi,</p>

      <p>Welcome to SeeHere. We hope your first session felt steady, private, and helpful.</p>

      <p>Sometimes the space between sessions is where insight begins to settle. We often recommend 6–8 sessions to truly see patterns emerge and for the mental noise to soften.</p>

      <p class="section-heading">Help us build the future of SeeHere</p>

      <p>As we are currently in our Beta phase, your perspective is incredibly valuable to us. If you could take a moment to share your thoughts via our <a href="https://forms.gle/koT1ZR1bcUn8nnkX9" class="feedback-link">Feedback Form</a>, we will add 6 free sessions to your vault as a thank you.</p>

      <p>There's no pressure. Come back when you're ready.</p>

      <div class="sign-off">
        <p>Your space is here,</p>
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
