export interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  created_at?: string;
}

export interface AnalysisResult {
  is_scam: boolean;
  scam_type: string;
  scam_category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence_score: number;
  confidence_label: string;
  how_it_works: string;
  red_flags: string[];
  action_steps: string[];
  relevant_law: string;
  safe_to_ignore: boolean;
  evidence_to_collect: string[];
  additional_note?: string | null;
}

export interface EvidenceItem {
  id: string;
  case_id: string;
  item_name: string;
  is_collected: boolean;
  notes?: string;
  created_at: string;
}

export interface DocumentInfo {
  id: string;
  case_id: string;
  doc_type: 'cybercrime_complaint' | 'bank_freeze_letter' | 'consumer_complaint';
  title: string;
  created_at: string;
}

export interface DocumentDetail extends DocumentInfo {
  content: string;
  placeholders: string[];
}

export interface Case {
  id: string;
  user_id: string;
  original_message: string;
  scam_type: string;
  scam_category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence_score: number;
  is_scam: boolean;
  how_it_works: string;
  red_flags: string[];
  action_steps: string[];
  relevant_law: string;
  status: string;
  created_at: string;
  updated_at: string;
  evidence_items?: EvidenceItem[];
  documents?: DocumentInfo[];
}

export interface CommunityReport {
  id: string;
  reported_by?: string | null;
  scam_type: string;
  scam_category: string;
  reported_number?: string | null;
  reported_url?: string | null;
  description?: string | null;
  city?: string | null;
  state?: string | null;
  report_count: number;
  created_at: string;
}
