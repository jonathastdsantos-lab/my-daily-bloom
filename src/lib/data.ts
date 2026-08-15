import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "./rotina";

export type Profile = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  height_cm: number | null;
  start_weight_kg: number | null;
  goal_weight_kg: number | null;
  water_goal_ml: number;
};

export type MealSchedule = {
  id: string;
  name: string;
  scheduled_time: string;
  sort_order: number;
  is_active: boolean;
};

export type MealLog = {
  id: string;
  schedule_id: string | null;
  log_date: string;
  logged_time: string;
  meal_name: string;
  description: string | null;
  portion: string | null;
  hunger_before: number | null;
  fullness_after: number | null;
  comment: string | null;
  difficulties: string[];
  difficulty_note: string | null;
};

export function useSessionUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { userId, email, loading };
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, display_name, height_cm, start_weight_kg, goal_weight_kg, water_goal_ml")
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useMealSchedules() {
  return useQuery({
    queryKey: ["meal_schedules"],
    queryFn: async (): Promise<MealSchedule[]> => {
      const { data, error } = await supabase
        .from("meal_schedules")
        .select("id, name, scheduled_time, sort_order, is_active")
        .eq("is_active", true)
        .order("scheduled_time");
      if (error) throw error;
      return (data ?? []) as MealSchedule[];
    },
  });
}

export function useMealLogs(from: string, to = from) {
  return useQuery({
    queryKey: ["meal_logs", from, to],
    queryFn: async (): Promise<MealLog[]> => {
      const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .gte("log_date", from)
        .lte("log_date", to)
        .order("log_date", { ascending: false })
        .order("logged_time", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MealLog[];
    },
  });
}

export function useWaterToday(date = todayISO()) {
  return useQuery({
    queryKey: ["water", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_logs")
        .select("amount_ml")
        .eq("log_date", date);
      if (error) throw error;
      return (data ?? []).reduce((sum, row) => sum + (row.amount_ml ?? 0), 0);
    },
  });
}

export function useWeightLogs() {
  return useQuery({
    queryKey: ["weight_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("id, log_date, weight_kg")
        .order("log_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as { id: string; log_date: string; weight_kg: number }[];
    },
  });
}

export function useMoodLogs(days = 14) {
  return useQuery({
    queryKey: ["mood_logs", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_logs")
        .select("id, log_date, mood, energy, note")
        .order("log_date", { ascending: false })
        .limit(days);
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        log_date: string;
        mood: number | null;
        energy: number | null;
        note: string | null;
      }[];
    },
  });
}

export function useTips() {
  return useQuery({
    queryKey: ["tips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tips")
        .select("id, category, title, summary, content")
        .eq("is_published", true)
        .order("category");
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        category: string;
        title: string;
        summary: string | null;
        content: string | null;
      }[];
    },
  });
}

export function useInvalidate() {
  const queryClient = useQueryClient();
  return (keys: string[]) => {
    keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
  };
}

export function useAddWater(date = todayISO()) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: number }) => {
      const { error } = await supabase
        .from("water_logs")
        .insert({ user_id: userId, log_date: date, amount_ml: amount });
      if (error) throw error;
    },
    onSuccess: () => invalidate(["water"]),
  });
}

export function useAddWeightLog() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ userId, weight_kg, log_date }: { userId: string; weight_kg: number; log_date: string }) => {
      const { error } = await supabase
        .from("weight_logs")
        .insert({ user_id: userId, weight_kg, log_date });
      if (error) throw error;
    },
    onSuccess: () => invalidate(["weight_logs", "profile"]),
  });
}

export function useUpdateProfile() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<Profile> }) => {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => invalidate(["profile"]),
  });
}

// ==========================================
// Professional Panel Hooks
// ==========================================

export function useUserRole() {
  const { userId } = useSessionUser();
  return useQuery({
    queryKey: ["user_role", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error; // ignore no rows
      return data?.role ?? "client";
    },
    enabled: !!userId,
  });
}

export function useProfessionalClients() {
  const { userId } = useSessionUser();
  return useQuery({
    queryKey: ["professional_clients", userId],
    queryFn: async () => {
      if (!userId) return [];
      // Fetch clients linked to this professional
      const { data, error } = await supabase
        .from("professional_clients")
        .select("client_id, status, profiles(full_name, avatar_url, goal_weight_kg)")
        .eq("professional_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useClientLogs(clientId: string | undefined) {
  return useQuery({
    queryKey: ["client_meal_logs", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", clientId)
        .order("log_date", { ascending: false })
        .order("logged_time", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
}
