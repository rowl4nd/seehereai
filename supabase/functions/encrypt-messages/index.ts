import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Encoding helpers ---

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// --- Key derivation ---

async function getEncryptionKey(): Promise<CryptoKey> {
  // Prefer a dedicated ENCRYPTION_KEY if set
  const encKeyRaw = Deno.env.get("ENCRYPTION_KEY");
  if (encKeyRaw) {
    return crypto.subtle.importKey(
      "raw",
      base64ToArrayBuffer(encKeyRaw),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );
  }

  // Otherwise derive a key from the service role key via HKDF
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const encoder = new TextEncoder();

  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(serviceRoleKey),
    "HKDF",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode("see-here-message-encryption-v1"),
      info: encoder.encode("aes-256-gcm-messages"),
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// --- Encrypt / Decrypt primitives ---

async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return arrayBufferToBase64(combined.buffer);
}

async function decrypt(encoded: string, key: CryptoKey): Promise<string> {
  const combined = new Uint8Array(base64ToArrayBuffer(encoded));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

// --- Message-level helpers ---

function isEncrypted(messages: unknown): boolean {
  return (
    typeof messages === "object" &&
    messages !== null &&
    !Array.isArray(messages) &&
    "v" in (messages as Record<string, unknown>) &&
    "data" in (messages as Record<string, unknown>)
  );
}

async function decryptMessages(messages: unknown, key: CryptoKey): Promise<unknown[]> {
  if (isEncrypted(messages)) {
    const { data } = messages as { v: number; data: string };
    const plaintext = await decrypt(data, key);
    return JSON.parse(plaintext);
  }
  // Legacy plaintext — return as-is
  if (Array.isArray(messages)) return messages;
  return [];
}

async function encryptMessages(
  messages: unknown[],
  key: CryptoKey,
): Promise<{ v: number; data: string }> {
  const plaintext = JSON.stringify(messages);
  const data = await encrypt(plaintext, key);
  return { v: 1, data };
}

// --- Response helper ---

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// --- Main handler ---

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await userClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const userId = claimsData.claims.sub as string;

    // Service-role client for DB operations (bypasses RLS; we enforce ownership manually)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const key = await getEncryptionKey();
    const { action, ...params } = await req.json();

    switch (action) {
      // ---- CREATE a new conversation with encrypted messages ----
      case "create": {
        const { sessionId, messages } = params;
        const encrypted = await encryptMessages(messages, key);
        const { data, error } = await adminClient
          .from("conversations")
          .insert({ session_id: sessionId, user_id: userId, messages: encrypted })
          .select("id")
          .single();
        if (error) throw error;
        return jsonResponse({ id: data.id });
      }

      // ---- SAVE (update) messages on an existing conversation ----
      case "save": {
        const { conversationId, messages } = params;
        // Verify ownership
        const { data: conv } = await adminClient
          .from("conversations")
          .select("user_id")
          .eq("id", conversationId)
          .single();
        if (!conv || conv.user_id !== userId) {
          return jsonResponse({ error: "Not found" }, 404);
        }
        const encrypted = await encryptMessages(messages, key);
        const { error } = await adminClient
          .from("conversations")
          .update({ messages: encrypted })
          .eq("id", conversationId);
        if (error) throw error;
        return jsonResponse({ success: true });
      }

      // ---- LOAD conversations for a given session ----
      case "load": {
        const { sessionId } = params;
        const { data, error } = await adminClient
          .from("conversations")
          .select("id, messages")
          .eq("session_id", sessionId)
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;

        const decrypted = await Promise.all(
          (data || []).map(async (c) => ({
            id: c.id,
            messages: await decryptMessages(c.messages, key),
          })),
        );
        return jsonResponse({ conversations: decrypted });
      }

      // ---- LOAD-HISTORY: last 5 conversations for AI context ----
      case "load-history": {
        const { data, error } = await adminClient
          .from("conversations")
          .select("messages")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5);
        if (error) throw error;

        const decrypted = await Promise.all(
          (data || []).map(async (c) => ({
            messages: await decryptMessages(c.messages, key),
          })),
        );
        return jsonResponse({ conversations: decrypted });
      }

      default:
        return jsonResponse({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    console.error("encrypt-messages error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
