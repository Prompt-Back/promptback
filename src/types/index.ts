export interface AnalysisData {
  coreIntentPrompt: string;
  uiSystemPrompt: string;
  componentPrompts: Record<string, string>;
  styleDna: string[];
  assumptions: string;
  confidenceLevel: string;
}

export interface AnalysisRequest {
  type: 'url' | 'description';
  value: string;
}

export interface AnalysisRecord extends AnalysisData {
  id: string;
  created_at: string;
  input_type: 'url' | 'description';
  input_value: string;
  user_id?: string;
  is_public: boolean;
  view_count: number;
}

export type InputMode = 'url' | 'description';

export type ConfidenceLevel = 'High confidence' | 'Medium confidence' | 'Low confidence';

export interface StyleDNATrait {
  name: string;
  description: string;
  category: 'aesthetic' | 'technical' | 'functional';
}

export const STYLE_DNA_TRAITS: StyleDNATrait[] = [
  { name: 'Minimal', description: 'Clean, reduced visual elements', category: 'aesthetic' },
  { name: 'Editorial', description: 'Magazine-like layout and typography', category: 'aesthetic' },
  { name: 'Brutalist', description: 'Raw, unpolished design choices', category: 'aesthetic' },
  { name: 'Fintech-grade', description: 'Professional financial services aesthetic', category: 'functional' },
  { name: 'Developer-centric', description: 'Technical, code-focused design', category: 'functional' },
  { name: 'Crypto-native', description: 'Web3/blockchain aesthetic elements', category: 'aesthetic' },
  { name: 'Enterprise-calm', description: 'Conservative, trustworthy business style', category: 'functional' },
  { name: 'Experimental', description: 'Unconventional, boundary-pushing design', category: 'aesthetic' },
  { name: 'Dashboard-heavy', description: 'Data visualization focused', category: 'technical' },
  { name: 'Mobile-first', description: 'Designed primarily for small screens', category: 'technical' },
  { name: 'Content-dense', description: 'High information density layout', category: 'technical' },
  { name: 'Whitespace-rich', description: 'Generous spacing and breathing room', category: 'aesthetic' },
];
