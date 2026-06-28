import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function genCode(): string {
  const part = () =>
    Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(0, 4).toUpperCase();
  return `SEEHERE-${part()}-${new Date().getFullYear()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Identify caller
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Verify admin
    const { data: adminRow } = await admin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action || "list";

    if (action === "list") {
      const { data: codes, error } = await admin
        .from("access_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ codes: codes || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const label = typeof body.label === "string" ? body.label.trim() : null;
      const maxRedemptions =
        Number.isFinite(body.max_redemptions) && body.max_redemptions > 0
          ? Math.floor(body.max_redemptions)
          : 10;
      const expiresAt = body.expires_at ? new Date(body.expires_at).toISOString() : null;
      let code =
        typeof body.code === "string" && body.code.trim()
          ? body.code.trim().toUpperCase()
          : genCode();

      const { data: created, error } = await admin
        .from("access_codes")
        .insert({
          code,
          label,
          max_redemptions: maxRedemptions,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return new Response(JSON.stringify({ error: "That code already exists" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw error;
      }

      return new Response(JSON.stringify({ code: created }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const id = body.id;
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { count, error: countErr } = await admin
        .from("code_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("code_id", id);
      if (countErr) throw countErr;

      if ((count ?? 0) > 0) {
        return new Response(
          JSON.stringify({
            error:
              "This code has already been redeemed and can't be deleted — deactivate it instead.",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { error } = await admin.from("access_codes").delete().eq("id", id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "toggle") {
      const id = body.id;
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: updated, error } = await admin
        .from("access_codes")
        .update({ is_active: !!body.is_active })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ code: updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-access-codes error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
