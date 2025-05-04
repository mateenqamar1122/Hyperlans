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
      ai_chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          messages: Json
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages: Json
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_saved_responses: {
        Row: {
          content: string
          created_at: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      client_access: {
        Row: {
          access_level: string
          client_id: string
          created_at: string
          id: string
          last_access: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          client_id: string
          created_at?: string
          id?: string
          last_access?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          client_id?: string
          created_at?: string
          id?: string
          last_access?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_access_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_collaborators: {
        Row: {
          client_id: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          project_id: string
          role: string
          status: string
          token: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          project_id: string
          role?: string
          status?: string
          token: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          project_id?: string
          role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_invitations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_feedback: {
        Row: {
          attachment_url: string | null
          client_id: string
          content: string
          created_at: string
          id: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          client_id: string
          content: string
          created_at?: string
          id: string
          project_id: string
          status: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_invitations: {
        Row: {
          client_id: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          project_id: string
          status: string
          token: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          project_id: string
          status: string
          token: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          project_id?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          auth_user_id: string | null
          city: string | null
          company: string | null
          contact_name: string | null
          contact_position: string | null
          country: string | null
          created_at: string | null
          email: string
          has_portal_access: boolean | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          temp_password: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          city?: string | null
          company?: string | null
          contact_name?: string | null
          contact_position?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          has_portal_access?: boolean | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          temp_password?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          city?: string | null
          company?: string | null
          contact_name?: string | null
          contact_position?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          has_portal_access?: boolean | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          temp_password?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      content_generations: {
        Row: {
          content: string
          content_type: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          prompt: string
          tags: string[] | null
          title: string
          tone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          prompt: string
          tags?: string[] | null
          title: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          prompt?: string
          tags?: string[] | null
          title?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          active_projects: number | null
          completed_projects: number | null
          id: string
          last_month_revenue: number | null
          last_updated: string | null
          monthly_revenue: number | null
          tasks_completion_rate: number | null
          total_projects: number | null
          user_id: string
          yearly_revenue: number | null
        }
        Insert: {
          active_projects?: number | null
          completed_projects?: number | null
          id?: string
          last_month_revenue?: number | null
          last_updated?: string | null
          monthly_revenue?: number | null
          tasks_completion_rate?: number | null
          total_projects?: number | null
          user_id: string
          yearly_revenue?: number | null
        }
        Update: {
          active_projects?: number | null
          completed_projects?: number | null
          id?: string
          last_month_revenue?: number | null
          last_updated?: string | null
          monthly_revenue?: number | null
          tasks_completion_rate?: number | null
          total_projects?: number | null
          user_id?: string
          yearly_revenue?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          expense_date: string
          id: string
          payment_method: string | null
          project_id: string | null
          receipt_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          project_id?: string | null
          receipt_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          project_id?: string | null
          receipt_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      file_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      file_items: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          file_type: string
          id: string
          is_archived: boolean | null
          is_folder: boolean | null
          is_starred: boolean | null
          last_accessed_at: string | null
          name: string
          parent_folder_id: string | null
          public_url: string
          shared_with: string[] | null
          size_bytes: number
          storage_path: string
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          file_type: string
          id?: string
          is_archived?: boolean | null
          is_folder?: boolean | null
          is_starred?: boolean | null
          last_accessed_at?: string | null
          name: string
          parent_folder_id?: string | null
          public_url: string
          shared_with?: string[] | null
          size_bytes: number
          storage_path: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          file_type?: string
          id?: string
          is_archived?: boolean | null
          is_folder?: boolean | null
          is_starred?: boolean | null
          last_accessed_at?: string | null
          name?: string
          parent_folder_id?: string | null
          public_url?: string
          shared_with?: string[] | null
          size_bytes?: number
          storage_path?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "file_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_items_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "file_items"
            referencedColumns: ["id"]
          },
        ]
      }
      file_shares: {
        Row: {
          access_level: string
          created_at: string | null
          expires_at: string | null
          file_id: string | null
          id: string
          shared_by: string | null
          shared_with: string | null
          token: string
        }
        Insert: {
          access_level?: string
          created_at?: string | null
          expires_at?: string | null
          file_id?: string | null
          id?: string
          shared_by?: string | null
          shared_with?: string | null
          token: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          expires_at?: string | null
          file_id?: string | null
          id?: string
          shared_by?: string | null
          shared_with?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_shares_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "file_items"
            referencedColumns: ["id"]
          },
        ]
      }
      file_tags: {
        Row: {
          color: string | null
          created_at: string | null
          file_id: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          file_id?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          file_id?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_tags_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "file_items"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current: string
          deadline: string | null
          id: string
          progress: number | null
          target: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current: string
          deadline?: string | null
          id?: string
          progress?: number | null
          target: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current?: string
          deadline?: string | null
          id?: string
          progress?: number | null
          target?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      idea_votes: {
        Row: {
          created_at: string
          id: string
          idea_id: string | null
          user_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id?: string | null
          user_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string | null
          user_id?: string | null
          vote_type?: string
        }
        Relationships: []
      }
      insights: {
        Row: {
          active_projects: number | null
          average_completion_time: number | null
          completed_projects: number | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          key_metrics: Json | null
          last_interaction: string | null
          total_revenue: number | null
          total_time_spent: number | null
          upcoming_deadlines: Json[] | null
          updated_at: string | null
        }
        Insert: {
          active_projects?: number | null
          average_completion_time?: number | null
          completed_projects?: number | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          key_metrics?: Json | null
          last_interaction?: string | null
          total_revenue?: number | null
          total_time_spent?: number | null
          upcoming_deadlines?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          active_projects?: number | null
          average_completion_time?: number | null
          completed_projects?: number | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          key_metrics?: Json | null
          last_interaction?: string | null
          total_revenue?: number | null
          total_time_spent?: number | null
          upcoming_deadlines?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string | null
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          timestamp: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          timestamp?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          timestamp?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pomodoro_sessions: {
        Row: {
          created_at: string | null
          duration: number
          end_time: string | null
          id: string
          session_type: string | null
          start_time: string | null
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration: number
          end_time?: string | null
          id?: string
          session_type?: string | null
          start_time?: string | null
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number
          end_time?: string | null
          id?: string
          session_type?: string | null
          start_time?: string | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pomodoro_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          client: string
          completion_date: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          technologies: string[] | null
          testimonial: string | null
          title: string
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          client: string
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          technologies?: string[] | null
          testimonial?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          client?: string
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          technologies?: string[] | null
          testimonial?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_modules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          project_id: string
          rich_content: Json | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          project_id: string
          rich_content?: Json | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string
          rich_content?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          payment_date: string | null
          project_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          payment_date?: string | null
          project_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          payment_date?: string | null
          project_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_progress: {
        Row: {
          created_at: string | null
          id: string
          progress_percentage: number | null
          project_id: string
          user_id: string
          week_number: number
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          project_id: string
          user_id: string
          week_number: number
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          project_id?: string
          user_id?: string
          week_number?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string | null
          project_role: string | null
          role: string | null
          team_member_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id?: string | null
          project_role?: string | null
          role?: string | null
          team_member_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string | null
          project_role?: string | null
          role?: string | null
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          banner_url: string | null
          budget: number | null
          category: string | null
          client_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          manager_notes: string | null
          name: string
          priority: string | null
          progress: number | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          budget?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          manager_notes?: string | null
          name: string
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          budget?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          manager_notes?: string | null
          name?: string
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_history: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          month: number
          user_id: string
          year: number
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          month: number
          user_id: string
          year: number
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          month?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_recurring: boolean | null
          labels: string[] | null
          last_updated_by: string | null
          priority: string | null
          project_id: string | null
          recurring_pattern: string | null
          related_tasks: string[] | null
          status: string | null
          tags: string[] | null
          time_estimate: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          labels?: string[] | null
          last_updated_by?: string | null
          priority?: string | null
          project_id?: string | null
          recurring_pattern?: string | null
          related_tasks?: string[] | null
          status?: string | null
          tags?: string[] | null
          time_estimate?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring?: boolean | null
          labels?: string[] | null
          last_updated_by?: string | null
          priority?: string | null
          project_id?: string | null
          recurring_pattern?: string | null
          related_tasks?: string[] | null
          status?: string | null
          tags?: string[] | null
          time_estimate?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          push_notifications: boolean | null
          session_timeout: string | null
          theme: string | null
          timezone: string | null
          two_factor_auth: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          session_timeout?: string | null
          theme?: string | null
          timezone?: string | null
          two_factor_auth?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          session_timeout?: string | null
          theme?: string | null
          timezone?: string | null
          two_factor_auth?: boolean | null
          updated_at?: string | null
          user_id?: string
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
      idea_priority: "low" | "medium" | "high" | "critical"
      idea_status:
        | "draft"
        | "evaluating"
        | "approved"
        | "in_progress"
        | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      idea_priority: ["low", "medium", "high", "critical"],
      idea_status: [
        "draft",
        "evaluating",
        "approved",
        "in_progress",
        "completed",
      ],
    },
  },
} as const
