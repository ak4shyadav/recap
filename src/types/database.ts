export interface ActionItem {
  task: string;
  owner: string;
  priority: string;
}

export interface Recap {
  id: string;
  user_id: string;
  input_text: string;
  executive_summary: string;
  key_highlights: string[];
  decisions_taken: string[];
  risks_blockers: string[];
  action_items: ActionItem[];
  next_steps: string[];
  created_at: string;
}
