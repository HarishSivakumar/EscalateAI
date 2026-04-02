'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { RiskBadge, RiskScore, StatusBadge } from '@/components/shared/Badges';
import {
  MOCK_CONVERSATIONS,
  MOCK_RISK_TREND,
  MOCK_ESCALATION_TREND,
  MOCK_FAILURE_BREAKDOWN,
  MOCK_SIGNAL_FREQUENCIES,
  MOCK_VOLUME_TREND,
} from '@/lib/mock-data';
import { CHART_COLORS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, Filter } from 'lucide-react';
import dynamic from 'next/dynamic';

const RiskProgressionChart = dynamic(() => import('@/components/analytics/RiskProgressionChart'), { ssr: false });
const FailureBreakdownChart = dynamic(() => import('@/components/analytics/FailureBreakdownChart'), { ssr: false });
const EscalationTrendChart = dynamic(() => import('@/components/analytics/EscalationTrendChart'), { ssr: false });

export default function AnalyticsPage() {
  const p1Count = MOCK_CONVERSATIONS.filter((c) => c.analysis.priority === 'P1').length;
  const p2Count = MOCK_CONVERSATIONS.filter((c) => c.analysis.priority === 'P2').length;
  const p3Count = MOCK_CONVERSATIONS.filter((c) => c.analysis.priority === 'P3').length;
  const escalatedCount = MOCK_CONVERSATIONS.filter((c) => c.analysis.predicted_escalation).length;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Analytics Dashboard</h2>
          <p className="text-xs text-slate-500">Comprehensive insights into escalation patterns and signal distribution</p>
        </div>
        <div className="flex gap-2">
          {['7D', '14D', '30D', '90D'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === '30D'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300 border border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'P1 Incidents', value: p1Count, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'P2 Incidents', value: p2Count, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'P3 Incidents', value: p3Count, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Escalated', value: escalatedCount, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`border-white/[0.06] bg-[#111827] p-4 ${item.border}`}>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{item.label}</p>
              <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Progression */}
        <Card className="border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Risk Score Progression</h3>
          </div>
          <div className="h-[280px]">
            <RiskProgressionChart riskData={MOCK_RISK_TREND} volumeData={MOCK_VOLUME_TREND} />
          </div>
        </Card>

        {/* Failure Breakdown */}
        <Card className="border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Failure Root Cause Breakdown</h3>
          </div>
          <div className="h-[280px]">
            <FailureBreakdownChart data={MOCK_FAILURE_BREAKDOWN} />
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Escalation Trend */}
        <Card className="lg:col-span-2 border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Escalation Trend (Daily)</h3>
          </div>
          <div className="h-[250px]">
            <EscalationTrendChart data={MOCK_ESCALATION_TREND} />
          </div>
        </Card>

        {/* Signal Frequency */}
        <Card className="border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Signal Frequency</h3>
          </div>
          <div className="space-y-3">
            {MOCK_SIGNAL_FREQUENCIES.map((signal, i) => (
              <motion.div
                key={signal.signal}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-300">{signal.signal}</span>
                  <span className="text-xs font-mono text-slate-500">{signal.count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${
                        Object.values(CHART_COLORS)[i]
                      }80, ${Object.values(CHART_COLORS)[i]})`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card className="border-white/[0.06] bg-[#111827] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Conversation Insights</h3>
          </div>
          <span className="text-xs text-slate-500">{MOCK_CONVERSATIONS.length} conversations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['ID', 'Customer', 'Category', 'Risk', 'Priority', 'Status', 'Root Cause', 'Messages'].map((h) => (
                  <th key={h} className="text-left text-[10px] text-slate-500 uppercase tracking-wider py-2 px-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_CONVERSATIONS.map((conv) => (
                <tr
                  key={conv.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-400">{conv.id}</td>
                  <td className="py-2.5 px-3 text-xs text-white font-medium">{conv.customer_name}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{conv.category}</td>
                  <td className="py-2.5 px-3"><RiskScore score={conv.analysis.risk} size="sm" /></td>
                  <td className="py-2.5 px-3"><RiskBadge priority={conv.analysis.priority} size="sm" /></td>
                  <td className="py-2.5 px-3"><StatusBadge status={conv.status} /></td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{conv.analysis.root_cause.replace(/_/g, ' ')}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-500 font-mono">{conv.messages.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
}
