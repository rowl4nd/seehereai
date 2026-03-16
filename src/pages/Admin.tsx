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

const FUNNEL_STEPS = [
  "disclosure_shown",
  "disclosure_accepted",
  "guest_message_sent",
  "signup_modal_shown",
  "account_created",
  "session_started",
  "cooldown_page_viewed",
  "credits_page_viewed",
  "purchase_started",
  "purchase_completed",
];

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
  const funnelCounts = FUNNEL_STEPS.map((step) => {
    const found = counts.find((c) => c.event_name === step);
    return { step, count: found?.count || 0 };
  });

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

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {funnelCounts.map((item, i) => (
              <div key={item.step} className="flex items-center">
                <div className="text-center min-w-[100px]">
                  <div className="text-xs text-muted-foreground truncate max-w-[100px]" title={item.step}>
                    {item.step.replace(/_/g, " ")}
                  </div>
                  <div className="text-xl font-bold text-foreground">{item.count}</div>
                  {i > 0 && funnelCounts[i - 1].count > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {((item.count / funnelCounts[i - 1].count) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
                {i < funnelCounts.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mx-1" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
