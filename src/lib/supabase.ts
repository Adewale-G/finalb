import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          username: string;
          role: 'admin' | 'lecturer' | 'student';
          date_of_birth: string | null;
          phone: string | null;
          address: string | null;
          faculty_id: string | null;
          department_id: string | null;
          matric_number: string | null;
          staff_id: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
          interests: string[] | null;
          emergency_contact: any | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          username: string;
          role?: 'admin' | 'lecturer' | 'student';
          date_of_birth?: string | null;
          phone?: string | null;
          address?: string | null;
          faculty_id?: string | null;
          department_id?: string | null;
          matric_number?: string | null;
          staff_id?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          interests?: string[] | null;
          emergency_contact?: any | null;
        };
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };

      faculties: {
        Row: {
          id: string;
          name: string;
          full_name: string;
          description: string | null;
          dean_name: string | null;
          dean_email: string | null;
          dean_phone: string | null;
          created_at: string;
        };
      };

      departments: {
        Row: {
          id: string;
          name: string;
          faculty_id: string;
          head_of_department: string | null;
          created_at: string;
        };
      };

      courses: {
        Row: {
          id: string;
          course_code: string;
          course_name: string;
          department_id: string;
          lecturer_id: string | null;
          credit_units: number;
          level: number;
          semester: number;
          description: string | null;
          created_at: string;
        };
      };

      user_posts: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          post_type: 'text' | 'image' | 'video';
          media_url: string | null;
          event_data: any | null;
          likes_count: number;
          comments_count: number;
          shares_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          post_type: 'text' | 'image' | 'video';
          media_url?: string | null;
          event_data?: any | null;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
        };
        Update: Partial<Omit<Database['public']['Tables']['user_posts']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };

      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
      };

      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
      };

      post_bookmarks: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
      };

      user_media: {
        Row: {
          id: string;
          user_id: string;
          media_type: string;
          filename: string;
          media_url: string;
          created_at: string;
        };
      };
    };
  };
};
