import { queryOptions } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

export type Organization = Tables<"aid_organizations">;
export type SupportGroup = Tables<"support_groups">;
export type ReliefUpdate = Tables<"relief_updates">;
export type AssistanceCenter = Tables<"assistance_centers">;
export type DisasterReport = Tables<"disaster_reports">;

// --- Helper to build full URLs on Server Side ---
const getApiUrl = (path: string) => {
  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:5173';
  return `${baseUrl}${path}`;
};

const mockOrgs: Organization[] = [
  {
    id: "1",
    name: "Kenya Red Cross Society",
    category: "non_profit",
    region: "National",
    description: "Providing emergency relief, food, and medical assistance across Kenya.",
    tags: ["Food", "Medical", "Shelter"],
    verified: true,
    amount_label: null,
    deadline: null,
    created_at: new Date().toISOString(),
    website: "https://www.redcross.or.ke/"
  },
  {
    id: "2",
    name: "Nairobi County Government Relief",
    category: "government",
    region: "Nairobi",
    description: "County-level grants and housing support for flood-affected families.",
    tags: ["Housing", "Grants"],
    verified: true,
    amount_label: "KES 50,000",
    deadline: "2026-12-31",
    created_at: new Date().toISOString(),
    website: null
  }
];

const mockGroups: SupportGroup[] = [
  {
    id: "1",
    name: "Mathare Flood Recovery Network",
    topic: "Flood Recovery",
    region: "Nairobi",
    description: "A community mutual aid group sharing resources and labor to rebuild homes in Mathare.",
    member_count: 1450,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Kisumu Evacuees Support",
    topic: "Evacuation Support",
    region: "Western Region",
    description: "Support and logistics coordination for families displaced in the Nyando Basin.",
    member_count: 890,
    created_at: new Date().toISOString()
  }
];

export const organizationsQuery = () =>
  queryOptions({
    queryKey: ["aid_organizations"],
    queryFn: async (): Promise<Organization[]> => {
      return mockOrgs;
    },
  });

export const supportGroupsQuery = () =>
  queryOptions({
    queryKey: ["support_groups"],
    queryFn: async (): Promise<SupportGroup[]> => {
      return mockGroups;
    },
  });

export const reliefUpdatesQuery = () =>
  queryOptions({
    queryKey: ["relief_updates"],
    queryFn: async (): Promise<ReliefUpdate[]> => {
      try {
        const res = await fetch(getApiUrl("/api/updates"));
        if (!res.ok) return [];
        return res.json();
      } catch (err) {
        console.error("Relief updates fetch failed:", err);
        return [];
      }
    },
  });

export const assistanceCentersQuery = () =>
  queryOptions({
    queryKey: ["assistance_centers"],
    queryFn: async (): Promise<AssistanceCenter[]> => {
      try {
        const res = await fetch(getApiUrl("/api/centers"));
        if (!res.ok) return [];
        return res.json();
      } catch (err) {
        console.error("Assistance centers fetch failed:", err);
        return [];
      }
    },
  });

export const myReportsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["disaster_reports", userId],
    enabled: !!userId,
    queryFn: async (): Promise<DisasterReport[]> => {
      return [];
    },
  });