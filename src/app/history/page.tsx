'use client';

import { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RiskBadge, RiskScore, StatusBadge, EmotionBadge } from '@/components/shared/Badges';
import { MOCK_CONVERSATIONS } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Headphones,
  Clock,
  Tag,
} from 'lucide-react';
import type { Conversation } from '@/lib/types';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'risk' | 'date'>('date');

  // Filter and sort
  let filtered = MOCK_CONVERSATIONS.filter((conv) => {
    const matchesSearch =
      conv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || conv.analysis.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (sortBy === 'risk') {
    filtered = [...filtered].sort((a, b) => b.analysis.risk - a.analysis.risk);
  } else {
    filtered = [...filtered].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  return (
    <PageWrapper>
      <div>
        <h2 className="text-lg font-semibold text-white">Conversation History</h2>
        <p className="text-xs text-slate-500">Browse and analyze past support conversations</p>
      </div>

      {/* Filters */}
      <Card className="border-white/[0.06] bg-[#111827] p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9 border-white/[0.06] bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-600"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] overflow-hidden">
            {['all', 'P1', 'P2', 'P3'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-2 text-xs font-medium transition-all ${
                  filterPriority === p
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] overflow-hidden">
            {['all', 'active', 'escalated', 'resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 text-xs font-medium transition-all capitalize ${
                  filterStatus === s
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] overflow-hidden">
            {[
              { key: 'date', label: 'Latest' },
              { key: 'risk', label: 'Highest Risk' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key as 'risk' | 'date')}
                className={`px-3 py-2 text-xs font-medium transition-all ${
                  sortBy === s.key
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-2">{filtered.length} conversations found</p>
      </Card>

      {/* Conversations List */}
      <div className="space-y-3">
        {filtered.map((conv, i) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card
              className="border-white/[0.06] bg-[#111827] overflow-hidden hover:border-white/[0.1] transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === conv.id ? null : conv.id)}
            >
              {/* Summary Row */}
              <div className="flex items-center gap-4 p-4">
                <div className={`h-2 w-2 rounded-full shrink-0 ${
                  conv.analysis.priority === 'P1' ? 'bg-red-500' :
                  conv.analysis.priority === 'P2' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white truncate">{conv.title}</span>
                    <RiskBadge priority={conv.analysis.priority} size="sm" />
                    <StatusBadge status={conv.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {conv.customer_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {conv.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {conv.messages.length} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {conv.created_at.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <RiskScore score={conv.analysis.risk} />
                  <EmotionBadge emotion={conv.analysis.emotion} />
                  {expandedId === conv.id ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expanded Detail */}
              <AnimatePresence>
                {expandedId === conv.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/[0.06] p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Messages */}
                        <div>
                          <h4 className="text-xs font-medium text-slate-400 mb-3">Conversation</h4>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {conv.messages.map((msg) => (
                              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? '' : ''}`}>
                                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                  msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {msg.role === 'user' ? <User className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Analysis */}
                        <div>
                          <h4 className="text-xs font-medium text-slate-400 mb-3">Analysis</h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                                <p className="text-[10px] text-slate-500">Root Cause</p>
                                <p className="text-xs font-medium text-slate-200">{conv.analysis.root_cause.replace(/_/g, ' ')}</p>
                              </div>
                              <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                                <p className="text-[10px] text-slate-500">Detection Point</p>
                                <p className="text-xs font-medium text-slate-200">Turn {conv.analysis.detection_point}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-500 mb-1.5">Explanation</p>
                              {conv.analysis.explanation.map((exp, ei) => (
                                <p key={ei} className="text-xs text-slate-400 flex items-start gap-1.5 mb-1">
                                  <span className="text-blue-400 mt-0.5">•</span>
                                  {exp}
                                </p>
                              ))}
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-500 mb-1.5">Suggested Actions</p>
                              {conv.analysis.suggested_actions.map((act, ai) => (
                                <p key={ai} className="text-xs text-amber-300/80 flex items-start gap-1.5 mb-1">
                                  <span className="text-amber-400 mt-0.5">→</span>
                                  {act}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
