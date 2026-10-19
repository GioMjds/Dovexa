export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        ComputedFields: never;
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      contact_methods: {
        Row: {
          contactId: string;
          id: string;
          isPrimary: boolean;
          label: string | null;
          type: Database['public']['Enums']['MethodType'];
          userId: string;
          value: string;
        };
        ComputedFields: never;
        Insert: {
          contactId: string;
          id: string;
          isPrimary?: boolean;
          label?: string | null;
          type: Database['public']['Enums']['MethodType'];
          userId: string;
          value: string;
        };
        Update: {
          contactId?: string;
          id?: string;
          isPrimary?: boolean;
          label?: string | null;
          type?: Database['public']['Enums']['MethodType'];
          userId?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contact_methods_contactId_fkey';
            columns: ['contactId'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contact_methods_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      contact_tags: {
        Row: {
          contactId: string;
          tagId: string;
          userId: string;
        };
        ComputedFields: never;
        Insert: {
          contactId: string;
          tagId: string;
          userId: string;
        };
        Update: {
          contactId?: string;
          tagId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contact_tags_contactId_fkey';
            columns: ['contactId'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contact_tags_tagId_fkey';
            columns: ['tagId'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contact_tags_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      contacts: {
        Row: {
          archivedAt: string | null;
          contactEveryDays: number | null;
          createdAt: string;
          firstName: string;
          id: string;
          lastContactedAt: string | null;
          lastName: string | null;
          nickname: string | null;
          organizationId: string | null;
          title: string | null;
          updatedAt: string;
          userId: string;
        };
        ComputedFields: never;
        Insert: {
          archivedAt?: string | null;
          contactEveryDays?: number | null;
          createdAt?: string;
          firstName: string;
          id: string;
          lastContactedAt?: string | null;
          lastName?: string | null;
          nickname?: string | null;
          organizationId?: string | null;
          title?: string | null;
          updatedAt: string;
          userId: string;
        };
        Update: {
          archivedAt?: string | null;
          contactEveryDays?: number | null;
          createdAt?: string;
          firstName?: string;
          id?: string;
          lastContactedAt?: string | null;
          lastName?: string | null;
          nickname?: string | null;
          organizationId?: string | null;
          title?: string | null;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_organizationId_fkey';
            columns: ['organizationId'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contacts_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      important_dates: {
        Row: {
          contactId: string;
          day: number;
          id: string;
          label: string;
          month: number;
          userId: string;
          year: number | null;
        };
        ComputedFields: never;
        Insert: {
          contactId: string;
          day: number;
          id: string;
          label: string;
          month: number;
          userId: string;
          year?: number | null;
        };
        Update: {
          contactId?: string;
          day?: number;
          id?: string;
          label?: string;
          month?: number;
          userId?: string;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'important_dates_contactId_fkey';
            columns: ['contactId'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'important_dates_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      interactions: {
        Row: {
          contactId: string;
          createdAt: string;
          id: string;
          occurredAt: string;
          summary: string;
          type: Database['public']['Enums']['InteractionType'];
          userId: string;
        };
        ComputedFields: never;
        Insert: {
          contactId: string;
          createdAt?: string;
          id: string;
          occurredAt: string;
          summary: string;
          type: Database['public']['Enums']['InteractionType'];
          userId: string;
        };
        Update: {
          contactId?: string;
          createdAt?: string;
          id?: string;
          occurredAt?: string;
          summary?: string;
          type?: Database['public']['Enums']['InteractionType'];
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'interactions_contactId_fkey';
            columns: ['contactId'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'interactions_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          body: string;
          contactId: string;
          createdAt: string;
          id: string;
          pinned: boolean;
          updatedAt: string;
          userId: string;
        };
        ComputedFields: never;
        Insert: {
          body: string;
          contactId: string;
          createdAt?: string;
          id: string;
          pinned?: boolean;
          updatedAt: string;
          userId: string;
        };
        Update: {
          body?: string;
          contactId?: string;
          createdAt?: string;
          id?: string;
          pinned?: boolean;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_contactId_fkey';
            columns: ['contactId'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      organizations: {
        Row: {
          createdAt: string;
          id: string;
          name: string;
          updatedAt: string;
          userId: string;
          website: string | null;
        };
        ComputedFields: never;
        Insert: {
          createdAt?: string;
          id: string;
          name: string;
          updatedAt: string;
          userId: string;
          website?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          name?: string;
          updatedAt?: string;
          userId?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'organizations_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          createdAt: string;
          email: string;
          id: string;
        };
        ComputedFields: never;
        Insert: {
          createdAt?: string;
          email: string;
          id: string;
        };
        Update: {
          createdAt?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          color: string | null;
          id: string;
          name: string;
          userId: string;
        };
        ComputedFields: never;
        Insert: {
          color?: string | null;
          id: string;
          name: string;
          userId: string;
        };
        Update: {
          color?: string | null;
          id?: string;
          name?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tags_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          completedAt: string | null;
          contactId: string | null;
          createdAt: string;
          dueAt: string | null;
          id: string;
          status: Database['public']['Enums']['TaskStatus'];
          title: string;
          updatedAt: string;
          userId: string;
        };
        ComputedFields: never;
        Insert: {
          completedAt?: string | null;
          contactId?: string | null;
          createdAt?: string;
          dueAt?: string | null;
          id: string;
          status?: Database['public']['Enums']['TaskStatus'];
          title: string;
          updatedAt: string;
          userId: string;
        };
        Update: {
          completedAt?: string | null;
          contactId?: string | null;
          createdAt?: string;
          dueAt?: string | null;
          id?: string;
          status?: Database['public']['Enums']['TaskStatus'];
          title?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_contactId_fkey';
            columns: ['contactId'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      InteractionType: 'CALL' | 'MEETING' | 'MESSAGE' | 'EMAIL' | 'OTHER';
      MethodType:
        'EMAIL' | 'PHONE' | 'LINKEDIN' | 'FACEBOOK' | 'INSTAGRAM' | 'OTHER';
      TaskStatus: 'OPEN' | 'DONE';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
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
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
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
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
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
      InteractionType: ['CALL', 'MEETING', 'MESSAGE', 'EMAIL', 'OTHER'],
      MethodType: [
        'EMAIL',
        'PHONE',
        'LINKEDIN',
        'FACEBOOK',
        'INSTAGRAM',
        'OTHER',
      ],
      TaskStatus: ['OPEN', 'DONE'],
    },
  },
} as const;
