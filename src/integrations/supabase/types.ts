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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          duration_min: number | null
          id: string
          intensity: string | null
          log_date: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          duration_min?: number | null
          id?: string
          intensity?: string | null
          log_date?: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          duration_min?: number | null
          id?: string
          intensity?: string | null
          log_date?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      body_measurements: {
        Row: {
          abdomen_cm: number | null
          arm_cm: number | null
          chest_cm: number | null
          created_at: string
          hip_cm: number | null
          id: string
          log_date: string
          thigh_cm: number | null
          updated_at: string
          user_id: string
          waist_cm: number | null
        }
        Insert: {
          abdomen_cm?: number | null
          arm_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          hip_cm?: number | null
          id?: string
          log_date?: string
          thigh_cm?: number | null
          updated_at?: string
          user_id: string
          waist_cm?: number | null
        }
        Update: {
          abdomen_cm?: number | null
          arm_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          hip_cm?: number | null
          id?: string
          log_date?: string
          thigh_cm?: number | null
          updated_at?: string
          user_id?: string
          waist_cm?: number | null
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          comment: string | null
          created_at: string
          description: string | null
          difficulties: string[]
          difficulty_note: string | null
          fullness_after: number | null
          hunger_before: number | null
          id: string
          log_date: string
          logged_time: string
          meal_name: string
          portion: string | null
          schedule_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          description?: string | null
          difficulties?: string[]
          difficulty_note?: string | null
          fullness_after?: number | null
          hunger_before?: number | null
          id?: string
          log_date?: string
          logged_time?: string
          meal_name: string
          portion?: string | null
          schedule_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          description?: string | null
          difficulties?: string[]
          difficulty_note?: string | null
          fullness_after?: number | null
          hunger_before?: number | null
          id?: string
          log_date?: string
          logged_time?: string
          meal_name?: string
          portion?: string | null
          schedule_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "meal_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_photos: {
        Row: {
          created_at: string
          id: string
          meal_log_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_log_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_log_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_photos_meal_log_id_fkey"
            columns: ["meal_log_id"]
            isOneToOne: false
            referencedRelation: "meal_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_schedules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          scheduled_time: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          scheduled_time: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          scheduled_time?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          energy: number | null
          id: string
          log_date: string
          mood: number | null
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          energy?: number | null
          id?: string
          log_date?: string
          mood?: number | null
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          energy?: number | null
          id?: string
          log_date?: string
          mood?: number | null
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      professional_clients: {
        Row: {
          client_id: string
          created_at: string
          id: string
          professional_id: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          professional_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          professional_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      professional_notes: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          professional_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          professional_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          professional_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          goal_weight_kg: number | null
          height_cm: number | null
          id: string
          start_weight_kg: number | null
          updated_at: string
          water_goal_ml: number
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          goal_weight_kg?: number | null
          height_cm?: number | null
          id: string
          start_weight_kg?: number | null
          updated_at?: string
          water_goal_ml?: number
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          goal_weight_kg?: number | null
          height_cm?: number | null
          id?: string
          start_weight_kg?: number | null
          updated_at?: string
          water_goal_ml?: number
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          category: string
          created_at: string
          id: string
          log_date: string
          storage_path: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          log_date?: string
          storage_path: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          log_date?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      tips: {
        Row: {
          category: string
          content: string | null
          created_at: string
          id: string
          is_published: boolean
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      water_logs: {
        Row: {
          amount_ml: number
          created_at: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: []
      }
      weight_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          note: string | null
          updated_at: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_date?: string
          note?: string | null
          updated_at?: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          note?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_client: { Args: { _client_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "client" | "professional" | "admin"
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
      app_role: ["client", "professional", "admin"],
    },
  },
} as const
