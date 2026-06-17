import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Organization = Tables<"aid_organizations">;
export type SupportGroup = Tables<"support_groups">;
export type ReliefUpdate = Tables<"relief_updates">;
export type AssistanceCenter = Tables<"assistance_centers">;
export type DisasterReport = Tables<"disaster_reports">;

export const organizationsQuery = () =>
  queryOptions({
    queryKey: ["aid_organizations"],
    queryFn: async (): Promise<Organization[]> => {
      const { data, error } = await supabase
        .from("aid_organizations")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

export const supportGroupsQuery = () =>
  queryOptions({
    queryKey: ["support_groups"],
    queryFn: async (): Promise<SupportGroup[]> => {
      const { data, error } = await supabase
        .from("support_groups")
        .select("*")
        .order("member_count", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const reliefUpdatesQuery = () =>
  queryOptions({
    queryKey: ["relief_updates"],
    queryFn: async (): Promise<ReliefUpdate[]> => {
      const { data, error } = await supabase
        .from("relief_updates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const assistanceCentersQuery = () =>
  queryOptions({
    queryKey: ["assistance_centers"],
    queryFn: async (): Promise<AssistanceCenter[]> => {
      const { data, error } = await supabase
        .from("assistance_centers")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

export const myReportsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["disaster_reports", userId],
    enabled: !!userId,
    queryFn: async (): Promise<DisasterReport[]> => {
      const { data, error } = await supabase
        .from("disaster_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
