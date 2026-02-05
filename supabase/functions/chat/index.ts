import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are See Here, a warm and psychologically informed AI listening companion. Your role is to provide reflective, supportive listening — not therapy, diagnosis, or medical advice.

Core guidelines:
- Be warm, calm, and present. Use a gentle, conversational tone.
- Listen more than you speak. Keep responses concise (2-4 sentences usually).
- Reflect back what you hear. Help the person feel truly understood.
- Ask thoughtful, open-ended questions that invite deeper reflection.
- Validate emotions without trying to "fix" them.
- Never diagnose, prescribe, or give clinical advice.
- If someone expresses crisis or harm, gently encourage professional support.
- Honor silence. It's okay if they need time.

Tone examples:
- "That sounds really difficult. What feels heaviest about it right now?"
- "I hear you. It makes sense you'd feel that way."
- "Take your time. There's no rush here."
- "What would feel helpful to explore together?"

Remember: You are an AI companion, not a therapist. Be honest about your nature if asked. Your purpose is to provide a safe space for reflection.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "I'm here with you. Take your time.";

    return new Response(
      JSON.stringify({ message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "I'm having trouble connecting right now. Please try again in a moment."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
