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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: adminCheck } = await serviceClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("start_date") || new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const endDate = url.searchParams.get("end_date") || new Date().toISOString().split("T")[0];
    const eventNameFilter = url.searchParams.get("event_name");

    let countQuery = serviceClient
      .from("analytics_events")
      .select("event_name, created_at, metadata")
      .gte("created_at", `${startDate}T00:00:00Z`)
      .lte("created_at", `${endDate}T23:59:59Z`);

    if (eventNameFilter) {
      countQuery = countQuery.eq("event_name", eventNameFilter);
    }

    const { data: events, error: eventsError } = await countQuery;

    if (eventsError) {
      return new Response(JSON.stringify({ error: eventsError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const countMap: Record<string, number> = {};
    const dailyMap: Record<string, number> = {};
    const filteredCounts: Record<string, number> = {};

    const SHARED_EVENTS = ["session_started", "cooldown_page_viewed"];

    for (const e of events || []) {
      countMap[e.event_name] = (countMap[e.event_name] || 0) + 1;
      const day = e.created_at.split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;

      // Build filtered counts for shared events by user_type
      if (SHARED_EVENTS.includes(e.event_name) && e.metadata) {
        const meta = typeof e.metadata === "string" ? JSON.parse(e.metadata) : e.metadata;
        const userType = meta?.user_type;
        if (userType === "new" || userType === "returning") {
          const key = `${e.event_name}:${userType}`;
          filteredCounts[key] = (filteredCounts[key] || 0) + 1;
        }
      }
    }

    const counts = Object.entries(countMap)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);

    const daily = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return new Response(JSON.stringify({ counts, daily, filtered_counts: filteredCounts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
