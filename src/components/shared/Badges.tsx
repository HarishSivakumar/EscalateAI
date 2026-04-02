'use client';

import { cn } from '@/lib/utils';
import { PRIORITY_COLORS } from '@/lib/constants';

interface RiskBadgeProps {
  priority: 'P1' | 'P2' | 'P3';
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ priority, size = 'md' }: RiskBadgeProps) {
  const colors = PRIORITY_COLORS[priority];
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-md border',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size]
      )}
    >
      {priority}
    </span>
  );
}

interface RiskScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskScore({ score, size = 'md', showLabel = true }: RiskScoreProps) {
  const getColor = (s: number) => {
    if (s >= 0.8) return { text: 'text-red-400', bg: 'bg-red-500' };
    if (s >= 0.6) return { text: 'text-amber-400', bg: 'bg-amber-500' };
    if (s >= 0.3) return { text: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { text: 'text-green-400', bg: 'bg-green-500' };
  };

  const color = getColor(score);
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn('font-mono font-bold', color.text, sizeClasses[size])}>
        {(score * 100).toFixed(0)}%
      </span>
      {showLabel && (
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden max-w-[80px]">
          <div
            className={cn('h-full rounded-full transition-all duration-1000', color.bg)}
            style={{ width: `${score * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface EmotionBadgeProps {
  emotion: string;
}

export function EmotionBadge({ emotion }: EmotionBadgeProps) {
  const emotionConfig: Record<string, { bg: string; text: string; emoji: string }> = {
    FRUSTRATED: { bg: 'bg-orange-500/10', text: 'text-orange-400', emoji: '😤' },
    ANGRY: { bg: 'bg-red-500/10', text: 'text-red-400', emoji: '😠' },
    CONFUSED: { bg: 'bg-purple-500/10', text: 'text-purple-400', emoji: '😕' },
    NEUTRAL: { bg: 'bg-slate-500/10', text: 'text-slate-400', emoji: '😐' },
    SATISFIED: { bg: 'bg-green-500/10', text: 'text-green-400', emoji: '😊' },
  };

  const config = emotionConfig[emotion] || emotionConfig.NEUTRAL;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border border-white/[0.04]',
        config.bg,
        config.text
      )}
    >
      <span>{config.emoji}</span>
      <span className="capitalize">{emotion.toLowerCase()}</span>
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'resolved' | 'escalated';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    active: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' },
    resolved: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500' },
    escalated: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
  };

  const c = config[status];

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border', c.bg, c.text, c.border)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
