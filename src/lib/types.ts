// ============================================================
// Escalation Intelligence Platform — Type Definitions
// ============================================================

export interface Message {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export interface SignalData {
  repetition: number;
  resolution_failure: boolean;
  technical_issue: boolean;
  sentiment_score: number;
  urgency: boolean;
}

export interface AnalysisResult {
  risk: number;
  priority: 'P1' | 'P2' | 'P3';
  predicted_escalation: boolean;
  detection_point: number;
  emotion: 'FRUSTRATED' | 'ANGRY' | 'CONFUSED' | 'NEUTRAL' | 'SATISFIED';
  root_cause: 'RESOLUTION_FAILURE' | 'TECHNICAL_ISSUE' | 'POOR_COMMUNICATION' | 'REPEATED_ISSUE' | 'SLA_BREACH' | 'NONE';
  signals: SignalData;
  explanation: string[];
  suggested_actions: string[];
  response_quality?: 'HIGH' | 'MEDIUM' | 'LOW';
  response_quality_reason?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  analysis: AnalysisResult;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'resolved' | 'escalated';
  customer_name: string;
  category: string;
}

export interface EvaluationMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  early_detection_score: number;
  false_positive_rate: number;
  accuracy: number;
  confusion_matrix: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  roc_data: { fpr: number; tpr: number }[];
  detection_points: { conversation_id: string; predicted_turn: number; actual_turn: number }[];
}

export interface DashboardStats {
  total_conversations: number;
  escalation_rate: number;
  avg_risk_score: number;
  active_alerts: number;
  resolved_today: number;
  avg_response_time: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SignalFrequency {
  signal: string;
  count: number;
  percentage: number;
}

export interface AlertItem {
  id: string;
  conversation_id: string;
  customer_name: string;
  risk: number;
  priority: 'P1' | 'P2' | 'P3';
  message: string;
  timestamp: Date;
  type: 'escalation' | 'risk_spike' | 'signal_detected';
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};

export interface Ticket {
  id: string;
  customer_name: string;
  email: string;
  subject: string;
  priority: 'P1' | 'P2' | 'P3';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'escalated';
  ai_summary: string;
  ai_transcript_snippet: string;
  category: string;
  risk: number;
  created_at: string;
  assigned_agent: string;
}
