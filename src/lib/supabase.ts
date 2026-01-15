import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Analysis = {
  id: string;
  created_at: string;
  input_type: 'url' | 'description';
  input_value: string;
  core_intent_prompt: string;
  ui_system_prompt: string;
  component_prompts: Record<string, string>;
  style_dna: string[];
  assumptions: string;
  confidence_level: string;
};
