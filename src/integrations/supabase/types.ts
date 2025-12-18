export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          changes: Json | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          ip_address: unknown;
          reason: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          changes?: Json | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          ip_address?: unknown;
          reason?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          changes?: Json | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          ip_address?: unknown;
          reason?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      blog_posts: {
        Row: {
          author_id: string | null;
          category: string | null;
          content: string;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          metadata: Json | null;
          published: boolean | null;
          published_at: string | null;
          slug: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          category?: string | null;
          content: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          metadata?: Json | null;
          published?: boolean | null;
          published_at?: string | null;
          slug: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          category?: string | null;
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          metadata?: Json | null;
          published?: boolean | null;
          published_at?: string | null;
          slug?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      bookings: {
        Row: {
          booking_type: string;
          client_id: string | null;
          created_at: string;
          duration_minutes: number;
          id: string;
          metadata: Json | null;
          notes: string | null;
          scheduled_at: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          booking_type: string;
          client_id?: string | null;
          created_at?: string;
          duration_minutes?: number;
          id?: string;
          metadata?: Json | null;
          notes?: string | null;
          scheduled_at: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          booking_type?: string;
          client_id?: string | null;
          created_at?: string;
          duration_minutes?: number;
          id?: string;
          metadata?: Json | null;
          notes?: string | null;
          scheduled_at?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      case_studies: {
        Row: {
          challenge: string;
          client_name: string;
          created_at: string;
          featured_image: string | null;
          gallery: Json | null;
          id: string;
          industry: string | null;
          metadata: Json | null;
          project_duration: string | null;
          published: boolean | null;
          results: string;
          slug: string;
          solution: string;
          technologies: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          challenge: string;
          client_name: string;
          created_at?: string;
          featured_image?: string | null;
          gallery?: Json | null;
          id?: string;
          industry?: string | null;
          metadata?: Json | null;
          project_duration?: string | null;
          published?: boolean | null;
          results: string;
          slug: string;
          solution: string;
          technologies?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          challenge?: string;
          client_name?: string;
          created_at?: string;
          featured_image?: string | null;
          gallery?: Json | null;
          id?: string;
          industry?: string | null;
          metadata?: Json | null;
          project_duration?: string | null;
          published?: boolean | null;
          results?: string;
          slug?: string;
          solution?: string;
          technologies?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consent_logs: {
        Row: {
          consent_type: string;
          created_at: string;
          granted: boolean;
          id: string;
          ip_address: unknown;
          metadata: Json | null;
          user_id: string | null;
        };
        Insert: {
          consent_type: string;
          created_at?: string;
          granted: boolean;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          user_id?: string | null;
        };
        Update: {
          consent_type?: string;
          created_at?: string;
          granted?: boolean;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'consent_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      downloads: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          download_count: number | null;
          file_path: string;
          file_size: number | null;
          file_type: string | null;
          id: string;
          metadata: Json | null;
          requires_auth: boolean | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          download_count?: number | null;
          file_path: string;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          metadata?: Json | null;
          requires_auth?: boolean | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          download_count?: number | null;
          file_path?: string;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          metadata?: Json | null;
          requires_auth?: boolean | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          config: Json | null;
          created_at: string;
          description: string | null;
          enabled: boolean | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          config?: Json | null;
          created_at?: string;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          config?: Json | null;
          created_at?: string;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          amount: number;
          client_id: string;
          created_at: string;
          currency: string;
          due_date: string;
          id: string;
          invoice_number: string;
          metadata: Json | null;
          paid_at: string | null;
          pdf_url: string | null;
          project_id: string | null;
          status: string;
          stripe_invoice_id: string | null;
          tax_amount: number | null;
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          amount: number;
          client_id: string;
          created_at?: string;
          currency?: string;
          due_date: string;
          id?: string;
          invoice_number: string;
          metadata?: Json | null;
          paid_at?: string | null;
          pdf_url?: string | null;
          project_id?: string | null;
          status?: string;
          stripe_invoice_id?: string | null;
          tax_amount?: number | null;
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          client_id?: string;
          created_at?: string;
          currency?: string;
          due_date?: string;
          id?: string;
          invoice_number?: string;
          metadata?: Json | null;
          paid_at?: string | null;
          pdf_url?: string | null;
          project_id?: string | null;
          status?: string;
          stripe_invoice_id?: string | null;
          tax_amount?: number | null;
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          client_id: string;
          created_at: string;
          currency: string;
          id: string;
          invoice_id: string;
          metadata: Json | null;
          payment_method: string | null;
          status: string;
          stripe_payment_id: string | null;
        };
        Insert: {
          amount: number;
          client_id: string;
          created_at?: string;
          currency?: string;
          id?: string;
          invoice_id: string;
          metadata?: Json | null;
          payment_method?: string | null;
          status?: string;
          stripe_payment_id?: string | null;
        };
        Update: {
          amount?: number;
          client_id?: string;
          created_at?: string;
          currency?: string;
          id?: string;
          invoice_id?: string;
          metadata?: Json | null;
          payment_method?: string | null;
          status?: string;
          stripe_payment_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          client_code: string | null;
          company_name: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          metadata: Json | null;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          client_code?: string | null;
          company_name?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          metadata?: Json | null;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          client_code?: string | null;
          company_name?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          metadata?: Json | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          budget: number | null;
          client_id: string;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          metadata: Json | null;
          project_type: string;
          start_date: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          budget?: number | null;
          client_id: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          metadata?: Json | null;
          project_type: string;
          start_date?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          budget?: number | null;
          client_id?: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          metadata?: Json | null;
          project_type?: string;
          start_date?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      quotes: {
        Row: {
          client_id: string | null;
          created_at: string;
          estimated_cost: number;
          id: string;
          metadata: Json | null;
          project_details: Json;
          service_type: string;
          status: string;
          updated_at: string;
          valid_until: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          estimated_cost: number;
          id?: string;
          metadata?: Json | null;
          project_details: Json;
          service_type: string;
          status?: string;
          updated_at?: string;
          valid_until: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          estimated_cost?: number;
          id?: string;
          metadata?: Json | null;
          project_details?: Json;
          service_type?: string;
          status?: string;
          updated_at?: string;
          valid_until?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quotes_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      telemetry_events: {
        Row: {
          created_at: string;
          event_data: Json;
          event_type: string;
          id: string;
          page_url: string | null;
          session_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_data: Json;
          event_type: string;
          id?: string;
          page_url?: string | null;
          session_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_data?: Json;
          event_type?: string;
          id?: string;
          page_url?: string | null;
          session_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'telemetry_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ticket_messages: {
        Row: {
          attachments: Json | null;
          created_at: string;
          id: string;
          is_internal: boolean | null;
          message: string;
          ticket_id: string;
          user_id: string;
        };
        Insert: {
          attachments?: Json | null;
          created_at?: string;
          id?: string;
          is_internal?: boolean | null;
          message: string;
          ticket_id: string;
          user_id: string;
        };
        Update: {
          attachments?: Json | null;
          created_at?: string;
          id?: string;
          is_internal?: boolean | null;
          message?: string;
          ticket_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ticket_messages_ticket_id_fkey';
            columns: ['ticket_id'];
            isOneToOne: false;
            referencedRelation: 'tickets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ticket_messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tickets: {
        Row: {
          assigned_to: string | null;
          category: string | null;
          client_id: string | null;
          created_at: string;
          description: string;
          id: string;
          metadata: Json | null;
          priority: string;
          project_id: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          description: string;
          id?: string;
          metadata?: Json | null;
          priority?: string;
          project_id?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          metadata?: Json | null;
          priority?: string;
          project_id?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tickets_assigned_to_fkey';
            columns: ['assigned_to'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tickets_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_client_code: { Args: never; Returns: string };
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role'];
          _user_id: string;
        };
        Returns: boolean;
      };
      get_dashboard_counts: {
        Args: never;
        Returns: {
          total_profiles: number;
          total_projects: number;
          total_quotes: number;
          total_bookings: number;
          total_invoices: number;
          total_tickets: number;
        };
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { '': string }; Returns: string[] };
    };
    Enums: {
      app_role: 'admin' | 'staff' | 'client';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['admin', 'staff', 'client'],
    },
  },
} as const;
