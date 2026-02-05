import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Credits {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error);
      } else {
        setCredits(data);
      }
      setLoading(false);
    };

    fetchCredits();
  }, [user]);

  return { credits, loading };
}
