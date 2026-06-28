import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AccessCode {
  id: string;
  code: string;
  label: string | null;
  max_redemptions: number;
  redemptions_used: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

async function callAdminCodes(body: Record<string, unknown>) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-access-codes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

export default function AccessCodesAdmin() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AccessCode | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [label, setLabel] = useState("");
  const [code, setCode] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("10");
  const [expiresAt, setExpiresAt] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const json = await callAdminCodes({ action: "list" });
      setCodes(json.codes || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load codes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await callAdminCodes({
        action: "create",
        label: label.trim() || null,
        code: code.trim() || undefined,
        max_redemptions: Number(maxRedemptions) || 10,
        expires_at: expiresAt || null,
      });
      toast.success("Access code created");
      setLabel("");
      setCode("");
      setMaxRedemptions("10");
      setExpiresAt("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create code");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await callAdminCodes({ action: "delete", id: pendingDelete.id });
      setCodes((prev) => prev.filter((x) => x.id !== pendingDelete.id));
      toast.success("Access code deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete code");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (c: AccessCode) => {
    try {
      await callAdminCodes({ action: "toggle", id: c.id, is_active: !c.is_active });
      setCodes((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, is_active: !x.is_active } : x))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update code");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create access code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-5 items-end">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Rasa staff pilot"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Code (optional)</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Auto-generated"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max uses</Label>
              <Input
                type="number"
                min={1}
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Expiry (optional)</Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="md:col-span-5">
              <Button type="submit" disabled={creating} size="sm">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create code"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Access codes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead className="text-center">Used</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.code}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.label || "—"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {c.redemptions_used} / {c.max_redemptions}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.expires_at
                        ? new Date(c.expires_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={c.is_active}
                        onCheckedChange={() => handleToggle(c)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(c)}
                        aria-label="Delete code"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {codes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No access codes yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete access code?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-mono font-medium">{pendingDelete?.code}</span>.
              Codes that have already been redeemed can't be deleted — deactivate
              them instead. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
