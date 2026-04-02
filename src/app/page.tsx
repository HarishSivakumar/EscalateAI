'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { RiskBadge, RiskScore } from '@/components/shared/Badges';
import { Card } from '@/components/ui/card';
import { MOCK_DASHBOARD_STATS, MOCK_ALERTS, MOCK_TICKETS, MOCK_RISK_TREND } from '@/lib/mock-data';
import {
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Ticket,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MiniRiskChart = dynamic(() => import('@/components/dashboard/MiniRiskChart'), { ssr: false });

const stats = MOCK_DASHBOARD_STATS;

const statCards = [
  {
    label: 'Total Conversations',
    value: stats.total_conversations,
    icon: MessageSquare,
    color: 'from-blue-500 to-blue-600',
    glowClass: 'glow-blue',
    change: '+12.5%',
    changeUp: true,
    decimals: 0,
    prefix: '',
    suffix: '',
  },
  {
    label: 'Escalation Rate',
    value: stats.escalation_rate,
    icon: TrendingUp,
    color: 'from-red-500 to-red-600',
    glowClass: 'glow-red',
    change: '-2.3%',
    changeUp: false,
    decimals: 1,
    prefix: '',
    suffix: '%',
  },
  {
    label: 'Avg Risk Score',
    value: stats.avg_risk_score * 100,
    icon: Activity,
    color: 'from-amber-500 to-amber-600',
    glowClass: 'glow-amber',
    change: '+1.8%',
    changeUp: true,
    decimals: 0,
    prefix: '',
    suffix: '%',
  },
  {
    label: 'Active Alerts',
    value: stats.active_alerts,
    icon: AlertTriangle,
    color: 'from-purple-500 to-purple-600',
    glowClass: 'glow-purple',
    change: '+3',
    changeUp: true,
    decimals: 0,
    prefix: '',
    suffix: '',
  },
  {
    label: 'Resolved Today',
    value: stats.resolved_today,
    icon: CheckCircle2,
    color: 'from-green-500 to-green-600',
    glowClass: 'glow-green',
    change: '+8',
    changeUp: true,
    decimals: 0,
    prefix: '',
    suffix: '',
  },
  {
    label: 'Avg Response Time',
    value: 4.2,
    icon: Clock,
    color: 'from-cyan-500 to-cyan-600',
    glowClass: 'glow-blue',
    change: '-0.5 min',
    changeUp: false,
    decimals: 1,
    prefix: '',
    suffix: ' min',
  },
];

// Sentiment color helpers
const sentimentConfig: Record<string, { label: string; color: string; bg: string }> = {
  POSITIVE: { label: 'Positive', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  NEGATIVE: { label: 'Negative', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  NEUTRAL: { label: 'Neutral', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  MIXED: { label: 'Mixed', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

const ticketStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  waiting: { label: 'Waiting', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  escalated: { label: 'Escalated', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function DashboardPage() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mesh-gradient border border-white/[0.06] p-6">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                <Shield className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">System Overview</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Escalation Intelligence</h2>
            <p className="text-sm text-slate-400 max-w-md">
              Monitoring {stats.total_conversations} conversations. {stats.active_alerts} active alerts requiring attention.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">System Health</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-400">Operational</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Model Accuracy</p>
              <span className="text-sm font-medium text-white">92.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="relative overflow-hidden border-white/[0.06] bg-[#111827] p-4 hover:border-white/[0.12] transition-all group cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.changeUp ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.changeUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <Card className="lg:col-span-2 border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Risk Trend</h3>
              <p className="text-xs text-slate-500">Average risk score over 30 days</p>
            </div>
            <div className="flex gap-1">
              {['7D', '14D', '30D'].map((period) => (
                <button
                  key={period}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                    period === '30D'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[240px]">
            <MiniRiskChart data={MOCK_RISK_TREND} />
          </div>
        </Card>

        {/* Quick Insights */}
        <Card className="border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              { text: '3 conversations show escalation patterns similar to past P1 incidents', color: 'border-red-500/30 bg-red-500/5' },
              { text: 'Resolution failure rate increased 12% this week — review agent training', color: 'border-amber-500/30 bg-amber-500/5' },
              { text: 'Authentication issues are the top signal today (4 cases)', color: 'border-blue-500/30 bg-blue-500/5' },
              { text: 'Early detection caught 85% of escalations before turn 4', color: 'border-green-500/30 bg-green-500/5' },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`rounded-lg border p-3 ${insight.color}`}
              >
                <p className="text-xs text-slate-300 leading-relaxed">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Ticket Table ── */}
      <Card className="border-white/[0.06] bg-[#111827] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Support Tickets</h3>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500/10 px-1.5 text-[10px] font-bold text-blue-400">
              {MOCK_TICKETS.length}
            </span>
          </div>
          <Link
            href="/history"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Ticket ID', 'Customer', 'Email', 'Subject', 'Priority', 'Sentiment', 'Risk', 'Status', 'AI Summary', 'Agent', 'Created'].map((h) => (
                  <th key={h} className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-2.5 px-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((ticket, i) => {
                const sentiment = sentimentConfig[ticket.sentiment] || sentimentConfig.NEUTRAL;
                const status = ticketStatusConfig[ticket.status] || ticketStatusConfig.open;

                return (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 px-3 text-xs font-mono text-blue-400 font-medium">{ticket.id}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shrink-0">
                          <User className="h-3 w-3 text-slate-300" />
                        </div>
                        <span className="text-xs text-white font-medium whitespace-nowrap">{ticket.customer_name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">{ticket.email}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-xs text-slate-300 max-w-[180px] truncate block">{ticket.subject}</span>
                    </td>
                    <td className="py-2.5 px-3"><RiskBadge priority={ticket.priority} size="sm" /></td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${sentiment.bg} ${sentiment.color}`}>
                        {sentiment.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3"><RiskScore score={ticket.risk} size="sm" /></td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="text-[11px] text-slate-400 leading-relaxed max-w-[260px]">{ticket.ai_summary}</p>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-400 whitespace-nowrap">{ticket.assigned_agent}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">{ticket.created_at}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Alerts */}
      <Card className="border-white/[0.06] bg-[#111827] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500/10 px-1.5 text-[10px] font-bold text-red-400">
              {MOCK_ALERTS.length}
            </span>
          </div>
          <Link
            href="/history"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {MOCK_ALERTS.slice(0, 5).map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`h-2 w-2 rounded-full shrink-0 ${
                  alert.priority === 'P1' ? 'bg-red-500' :
                  alert.priority === 'P2' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white truncate">{alert.customer_name}</span>
                    <RiskBadge priority={alert.priority} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 truncate">{alert.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <RiskScore score={alert.risk} size="sm" />
                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                  {alert.type === 'escalation' ? '🔴 Escalation' : alert.type === 'risk_spike' ? '📈 Risk Spike' : '📡 Signal'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </PageWrapper>
  );
}
