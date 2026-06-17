export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aid_organizations: {
        Row: {
          amount_label: string | null
          category: Database["public"]["Enums"]["org_category"]
          created_at: string
          deadline: string | null
          description: string
          id: string
          name: string
          region: string
          tags: string[]
          verified: boolean
          website: string | null
        }
        Insert: {
          amount_label?: string | null
          category: Database["public"]["Enums"]["org_category"]
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          name: string
          region?: string
          tags?: string[]
          verified?: boolean
          website?: string | null
        }
        Update: {
          amount_label?: string | null
          category?: Database["public"]["Enums"]["org_category"]
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          name?: string
          region?: string
          tags?: string[]
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      assistance_centers: {
        Row: {
          address: string
          created_at: string
          id: string
          is_open: boolean
          lat: number | null
          lng: number | null
          name: string
          phone: string | null
          region: string
          services: string[]
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_open?: boolean
          lat?: number | null
          lng?: number | null
          name: string
          phone?: string | null
          region?: string
          services?: string[]
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_open?: boolean
          lat?: number | null
          lng?: number | null
          name?: string
          phone?: string | null
          region?: string
          services?: string[]
        }
        Relationships: []
      }
      disaster_reports: {
        Row: {
          ai_summary: string | null
          created_at: string
          description: string
          disaster_type: Database["public"]["Enums"]["disaster_type"]
          id: string
          location: string
          needs: string[]
          severity: number
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          description: string
          disaster_type: Database["public"]["Enums"]["disaster_type"]
          id?: string
          location: string
          needs?: string[]
          severity?: number
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          description?: string
          disaster_type?: Database["public"]["Enums"]["disaster_type"]
          id?: string
          location?: string
          needs?: string[]
          severity?: number
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      relief_updates: {
        Row: {
          body: string
          created_at: string
          id: string
          region: string
          severity: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          region?: string
          severity?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          region?: string
          severity?: string
          title?: string
        }
        Relationships: []
      }
      support_groups: {
        Row: {
          created_at: string
          description: string
          id: string
          member_count: number
          name: string
          region: string
          topic: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          member_count?: number
          name: string
          region?: string
          topic: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          member_count?: number
          name?: string
          region?: string
          topic?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      disaster_type:
        | "flood"
        | "earthquake"
        | "drought"
        | "landslide"
        | "storm"
        | "wildfire"
        | "other"
      org_category: "government" | "non_profit" | "community" | "donor"
      report_status:
        | "submitted"
        | "under_review"
        | "matched"
        | "in_progress"
        | "resolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      disaster_type: [
        "flood",
        "earthquake",
        "drought",
        "landslide",
        "storm",
        "wildfire",
        "other",
      ],
      org_category: ["government", "non_profit", "community", "donor"],
      report_status: [
        "submitted",
        "under_review",
        "matched",
        "in_progress",
        "resolved",
      ],
    },
  },
} as const
