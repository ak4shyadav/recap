export interface Database {
  public: {
    Tables: {
      recaps: {
        Row: {
          id: string;
          user_id: string;
          input_text: string;
          executive_summary: string;
          key_highlights: string[];
          decisions_taken: string[];
          risks_blockers: string[];
          action_items: string[];
          next_steps: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_text: string;
          executive_summary?: string;
          key_highlights?: string[];
          decisions_taken?: string[];
          risks_blockers?: string[];
          action_items?: string[];
          next_steps?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_text?: string;
          executive_summary?: string;
          key_highlights?: string[];
          decisions_taken?: string[];
          risks_blockers?: string[];
          action_items?: string[];
          next_steps?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Recap = Database['public']['Tables']['recaps']['Row'];
