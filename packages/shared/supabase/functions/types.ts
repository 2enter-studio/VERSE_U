export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_versions: {
        Row: {
          created_at: string
          force_update: boolean
          id: string
          value: string
        }
        Insert: {
          created_at?: string
          force_update?: boolean
          id?: string
          value?: string
        }
        Update: {
          created_at?: string
          force_update?: boolean
          id?: string
          value?: string
        }
        Relationships: []
      }
      block_users: {
        Row: {
          blocked: string
          blocker: string
          created_at: string
          id: string
        }
        Insert: {
          blocked: string
          blocker?: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked?: string
          blocker?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_block_users_blocked_fkey"
            columns: ["blocked"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
          {
            foreignKeyName: "public_block_users_blocker_fkey"
            columns: ["blocker"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      body_parts: {
        Row: {
          created_at: string
          id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          value?: string
        }
        Relationships: []
      }
      chat_members: {
        Row: {
          agree: boolean
          chat: string
          created_at: string
          id: string
          user: string
        }
        Insert: {
          agree?: boolean
          chat: string
          created_at?: string
          id?: string
          user?: string
        }
        Update: {
          agree?: boolean
          chat?: string
          created_at?: string
          id?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_chat_members_chat_fkey"
            columns: ["chat"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_chat_members_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat: string
          content: string
          created_at: string
          id: string
          reply_to: string | null
          sender: string
        }
        Insert: {
          chat: string
          content: string
          created_at?: string
          id?: string
          reply_to?: string | null
          sender?: string
        }
        Update: {
          chat?: string
          content?: string
          created_at?: string
          id?: string
          reply_to?: string | null
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_fkey"
            columns: ["chat"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      chat_messages_2024_07: {
        Row: {
          chat: string
          content: string
          created_at: string
          id: string
          reply_to: string | null
          sender: string
        }
        Insert: {
          chat: string
          content: string
          created_at?: string
          id?: string
          reply_to?: string | null
          sender?: string
        }
        Update: {
          chat?: string
          content?: string
          created_at?: string
          id?: string
          reply_to?: string | null
          sender?: string
        }
        Relationships: []
      }
      chat_messages_2024_08: {
        Row: {
          chat: string
          content: string
          created_at: string
          id: string
          reply_to: string | null
          sender: string
        }
        Insert: {
          chat: string
          content: string
          created_at?: string
          id?: string
          reply_to?: string | null
          sender?: string
        }
        Update: {
          chat?: string
          content?: string
          created_at?: string
          id?: string
          reply_to?: string | null
          sender?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string
          id: string
          is_group_chat: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          is_group_chat?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_group_chat?: boolean
        }
        Relationships: []
      }
      coupons: {
        Row: {
          created_at: string
          id: string
          sponsor: string
          used: boolean
          user: string
        }
        Insert: {
          created_at?: string
          id?: string
          sponsor: string
          used?: boolean
          user: string
        }
        Update: {
          created_at?: string
          id?: string
          sponsor?: string
          used?: boolean
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_coupons_sponsor_fkey"
            columns: ["sponsor"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_coupons_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      hai_an_players: {
        Row: {
          created_at: string
          id: string
          player: string
        }
        Insert: {
          created_at?: string
          id?: string
          player?: string
        }
        Update: {
          created_at?: string
          id?: string
          player?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_hai_an_players_player_fkey"
            columns: ["player"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      "j-meshes-body_parts": {
        Row: {
          body_part: string
          created_at: string
          id: string
          mesh: string
        }
        Insert: {
          body_part: string
          created_at?: string
          id?: string
          mesh: string
        }
        Update: {
          body_part?: string
          created_at?: string
          id?: string
          mesh?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_j-meshes-body_parts_mesh_fkey"
            columns: ["mesh"]
            isOneToOne: false
            referencedRelation: "meshes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_j-wearings-body_parts_related_fkey"
            columns: ["body_part"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      "j-users-tags": {
        Row: {
          created_at: string
          id: string
          tag: string
          user: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          user: string
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_j-users-tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      "j-wearings-texture_types": {
        Row: {
          created_at: string
          id: string
          texture_type: string
          wearing: string
        }
        Insert: {
          created_at?: string
          id?: string
          texture_type?: string
          wearing?: string
        }
        Update: {
          created_at?: string
          id?: string
          texture_type?: string
          wearing?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_r_wearing_texture_types_texture_type_fkey"
            columns: ["texture_type"]
            isOneToOne: false
            referencedRelation: "texture_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_r_wearing_texture_types_wearing_fkey"
            columns: ["wearing"]
            isOneToOne: false
            referencedRelation: "wearings"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          end: string
          id: string
          start: string
        }
        Insert: {
          end?: string
          id?: string
          start?: string
        }
        Update: {
          end?: string
          id?: string
          start?: string
        }
        Relationships: []
      }
      meshes: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ml_texts: {
        Row: {
          column_name: string
          id: string
          locale: Database["public"]["Enums"]["language"]
          row_id: string
          value: string | null
        }
        Insert: {
          column_name: string
          id?: string
          locale?: Database["public"]["Enums"]["language"]
          row_id?: string
          value?: string | null
        }
        Update: {
          column_name?: string
          id?: string
          locale?: Database["public"]["Enums"]["language"]
          row_id?: string
          value?: string | null
        }
        Relationships: []
      }
      owned_wearings: {
        Row: {
          created_at: string
          equipped: boolean
          id: string
          owner: string
          wearing: string
        }
        Insert: {
          created_at?: string
          equipped?: boolean
          id?: string
          owner?: string
          wearing: string
        }
        Update: {
          created_at?: string
          equipped?: boolean
          id?: string
          owner?: string
          wearing?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_owned_wearings_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
          {
            foreignKeyName: "public_owned_wearings_wearing_fkey"
            columns: ["wearing"]
            isOneToOne: false
            referencedRelation: "wearings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clock_in: Json
          id: string
          last_active: string
          name: string
          public_id: string
          unergy: number
          user: string
        }
        Insert: {
          clock_in?: Json
          id?: string
          last_active?: string
          name: string
          public_id?: string
          unergy?: number
          user?: string
        }
        Update: {
          clock_in?: Json
          id?: string
          last_active?: string
          name?: string
          public_id?: string
          unergy?: number
          user?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          updated_at: string
          x: number
          y: number
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
          x?: number
          y?: number
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
          x?: number
          y?: number
        }
        Relationships: []
      }
      report_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_id: string
          perpetrator: string
          reason: string | null
          reporter: string
          resolve: boolean
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_id: string
          perpetrator: string
          reason?: string | null
          reporter?: string
          resolve?: boolean
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_id?: string
          perpetrator?: string
          reason?: string | null
          reporter?: string
          resolve?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_report_messages_perpetrator_fkey"
            columns: ["perpetrator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
          {
            foreignKeyName: "public_report_messages_reporter_fkey"
            columns: ["reporter"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      sponsor_wearings: {
        Row: {
          created_at: string
          id: string
          sponsor: string | null
          wearing: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          sponsor?: string | null
          wearing?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          sponsor?: string | null
          wearing?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_wearings_sponsor_fkey"
            columns: ["sponsor"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_wearings_wearing_fkey"
            columns: ["wearing"]
            isOneToOne: false
            referencedRelation: "wearings"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string
          id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          value?: string
        }
        Relationships: []
      }
      tag_types: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          type: string
        }
        Insert: {
          id?: string
          type: string
        }
        Update: {
          id?: string
          type?: string
        }
        Relationships: []
      }
      texture_types: {
        Row: {
          created_at: string
          id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          value?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          arrive_at: string
          created_at: string
          from: string
          id: string
          next_0: string
          next_1: string
          start_at: string
          to: string
          user: string
        }
        Insert: {
          arrive_at: string
          created_at?: string
          from: string
          id?: string
          next_0: string
          next_1: string
          start_at?: string
          to: string
          user?: string
        }
        Update: {
          arrive_at?: string
          created_at?: string
          from?: string
          id?: string
          next_0?: string
          next_1?: string
          start_at?: string
          to?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_trips_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_trips_next_0_fkey"
            columns: ["next_0"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_trips_next_1_fkey"
            columns: ["next_1"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_trips_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_trips_user_fkey"
            columns: ["user"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      trips_archived: {
        Row: {
          arrive_at: string
          from: string
          id: string
          start_at: string
          to: string
          user: string
        }
        Insert: {
          arrive_at: string
          from: string
          id?: string
          start_at: string
          to: string
          user: string
        }
        Update: {
          arrive_at?: string
          from?: string
          id?: string
          start_at?: string
          to?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_archived_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_archived_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_archived_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user"]
          },
        ]
      }
      wearing_types: {
        Row: {
          created_at: string
          id: string
          is_expression: boolean
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_expression?: boolean
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_expression?: boolean
          value?: string
        }
        Relationships: []
      }
      wearings: {
        Row: {
          category: string
          created_at: string
          enabled: boolean
          id: string
          in_starter_pack: boolean
          mesh: string
          price: number | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          enabled?: boolean
          id?: string
          in_starter_pack?: boolean
          mesh?: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          enabled?: boolean
          id?: string
          in_starter_pack?: boolean
          mesh?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_wearings_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "wearing_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_wearings_mesh_fkey"
            columns: ["mesh"]
            isOneToOne: false
            referencedRelation: "meshes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      agree_friendship: {
        Args: {
          chat_id: string
        }
        Returns: undefined
      }
      archive_trips: {
        Args: {
          ids: string[]
        }
        Returns: undefined
      }
      block_check: {
        Args: {
          user_0: string
          user_1: string
        }
        Returns: boolean
      }
      gen_random_text: {
        Args: {
          length: number
        }
        Returns: string
      }
      get_first_mesh_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_first_wearing_type_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_chat_member: {
        Args: {
          _user_id: string
          _chat_id: string
        }
        Returns: boolean
      }
      start_new_chat: {
        Args: {
          target_user_id: string
          first_message: string
        }
        Returns: string
      }
      update_last_active: {
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      language: "zh" | "en"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

