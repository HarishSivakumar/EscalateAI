// ============================================================
// Escalation Intelligence Platform — Constants
// ============================================================

export const APP_NAME = 'EscalateAI';
export const APP_DESCRIPTION = 'AI-Powered Escalation Intelligence Platform';

export const RISK_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.6,
  HIGH: 0.8,
} as const;

export const PRIORITY_COLORS = {
  P1: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'glow-red' },
  P2: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'glow-amber' },
  P3: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', glow: 'glow-green' },
} as const;

export const EMOTION_COLORS = {
  FRUSTRATED: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  ANGRY: { bg: 'bg-red-500/10', text: 'text-red-400' },
  CONFUSED: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  NEUTRAL: { bg: 'bg-slate-500/10', text: 'text-slate-400' },
  SATISFIED: { bg: 'bg-green-500/10', text: 'text-green-400' },
} as const;

export const SIGNAL_LABELS: Record<string, string> = {
  repetition: 'Repetition Detection',
  resolution_failure: 'Resolution Failure',
  technical_issue: 'Technical Issue',
  sentiment_score: 'Sentiment Score',
  urgency: 'Urgency Detection',
};

export const SIGNAL_ICONS: Record<string, string> = {
  repetition: 'Repeat',
  resolution_failure: 'XCircle',
  technical_issue: 'Bug',
  sentiment_score: 'Heart',
  urgency: 'AlertTriangle',
};

export const ROOT_CAUSE_LABELS: Record<string, string> = {
  RESOLUTION_FAILURE: 'Resolution Failure',
  TECHNICAL_ISSUE: 'Technical Issue',
  POOR_COMMUNICATION: 'Poor Communication',
  REPEATED_ISSUE: 'Repeated Issue',
  SLA_BREACH: 'SLA Breach',
  NONE: 'None Detected',
};

export const CHART_COLORS = {
  blue: '#3B82F6',
  purple: '#8B5CF6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
  cyan: '#06B6D4',
  pink: '#EC4899',
  indigo: '#6366F1',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Chat Simulation', href: '/chat', icon: 'MessageSquare' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { label: 'Evaluation', href: '/evaluation', icon: 'Target' },
  { label: 'History', href: '/history', icon: 'History' },
];
