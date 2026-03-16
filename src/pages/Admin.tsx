import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { CalendarIcon, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const NEW_USER_STEPS = [
  "disclosure_shown",
  "disclosure_accepted",
  "signup_modal_shown",
  "account_created",
  "cooldown_page_viewed",
];

const RETURNING_USER_STEPS = [
  "login_from_homepage",
  "session_started",
  "cooldown_page_viewed",
  "credits_page_viewed",
  "purchase_started",
  "purchase_completed",
];

const SHARED_EVENTS = ["session_started", "cooldown_page_viewed"];

const chartConfig: ChartConfig = {
  count: { label: "Events", color: "hsl(var(--primary))" },
};

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [counts, setCounts] = useState<{ event_name: string; count: number }[]>([]);
  const [daily, setDaily] = useState<{ date: string; count: number }[]>([]);
  const [filteredCounts, setFilteredCounts] = useState<Record<string, number>>({});
  const [fetching, setFetching] = useState(false);

  // Auth + admin check
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) {
          navigate("/", { replace: true });
        } else {
          setIsAdmin(true);
        }
      });
  }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    if (!isAdmin) return;
    setFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: null,
      });

      // Since GET with query params isn't straightforward via invoke, use fetch directly
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) return;

      const params = new URLSearchParams({
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      });

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-analytics?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (res.ok) {
        const json = await res.json();
        setCounts(json.counts || []);
        setDaily(json.daily || []);
        setFilteredCounts(json.filtered_counts || {});
      }
    } catch {
      // silent
    } finally {
      setFetching(false);
    }
  }, [isAdmin, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Build funnel data
  const getCount = (step: string) => counts.find((c) => c.event_name === step)?.count || 0;

  const homepageCount = getCount("homepage_viewed");
  const disclosureCount = getCount("disclosure_shown");
  const loginCount = getCount("login_from_homepage");
  const noInteraction = Math.max(0, homepageCount - disclosureCount - loginCount);

  const pct = (n: number, total: number) =>
    total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "—";

  const getFilteredCount = (step: string, userType: 'new' | 'returning') => {
    if (SHARED_EVENTS.includes(step)) {
      return filteredCounts[`${step}:${userType}`] || 0;
    }
    return getCount(step);
  };

  const newUserFunnel = NEW_USER_STEPS.map((step) => ({
    step,
    count: getFilteredCount(step, 'new'),
  }));

  const returningUserFunnel = RETURNING_USER_STEPS.map((step) => ({
    step,
    count: getFilteredCount(step, 'returning'),
  }));

  return (
    <div className="min-h-screen bg-background p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <DatePicker label="From" date={startDate} onSelect={setStartDate} />
          <DatePicker label="To" date={endDate} onSelect={setEndDate} />
          <Button onClick={fetchData} disabled={fetching} size="sm">
            {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Homepage Viewed */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">homepage viewed</div>
            <div className="text-3xl font-bold text-foreground">{homepageCount}</div>
          </div>

          {/* Three-way branch */}
          <div className="flex justify-center gap-4 mt-6">
            {[
              { label: "Started chatting", count: disclosureCount },
              { label: "Logged in", count: loginCount },
              { label: "No interaction", count: noInteraction },
            ].map((branch) => (
              <div
                key={branch.label}
                className="rounded-md border border-border bg-muted/30 px-4 py-3 text-center min-w-[140px]"
              >
                <div className="text-xs text-muted-foreground">{branch.label}</div>
                <div className="text-lg font-bold text-foreground">{branch.count}</div>
                <div className="text-xs text-muted-foreground">{pct(branch.count, homepageCount)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Journey Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelCard
          title="New User Journey"
          subtitle="From 'Started chatting'"
          steps={newUserFunnel}
          conversionLabel="New user conversion"
          conversionFrom={getFilteredCount('disclosure_shown', 'new')}
          conversionTo={getFilteredCount('account_created', 'new')}
        />
        <FunnelCard title="Returning User Journey" subtitle="From 'Logged in'" steps={returningUserFunnel} />
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {counts.map((row) => (
                <TableRow key={row.event_name}>
                  <TableCell className="font-mono text-sm">{row.event_name}</TableCell>
                  <TableCell className="text-right font-bold">{row.count}</TableCell>
                </TableRow>
              ))}
              {counts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No events in this date range
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Events</CardTitle>
        </CardHeader>
        <CardContent>
          {daily.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data to display</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DatePicker({
  label,
  date,
  onSelect,
}: {
  label: string;
  date: Date;
  onSelect: (d: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span className="text-xs">{label}: {format(date, "MMM d")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && onSelect(d)}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

function FunnelCard({
  title,
  subtitle,
  steps,
  conversionLabel,
  conversionFrom,
  conversionTo,
}: {
  title: string;
  subtitle: string;
  steps: { step: string; count: number }[];
  conversionLabel?: string;
  conversionFrom?: number;
  conversionTo?: number;
}) {
  const pct = (n: number, total: number) =>
    total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "—";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-1">
        {steps.map((item, i) => (
          <div key={item.step}>
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-2">
              <span className="text-sm text-muted-foreground">{item.step.replace(/_/g, " ")}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">{item.count}</span>
                {i > 0 && steps[i - 1].count > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {pct(item.count, steps[i - 1].count)}
                  </span>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground rotate-90" />
              </div>
            )}
          </div>
        ))}
        {conversionLabel && conversionFrom != null && conversionTo != null && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {conversionLabel}:{" "}
              <span className="font-semibold text-foreground">
                {conversionFrom > 0
                  ? `${((conversionTo / conversionFrom) * 100).toFixed(1)}%`
                  : "—"}
              </span>
              {conversionFrom > 0 && (
                <span className="ml-1">
                  ({conversionTo} of {conversionFrom})
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
