'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RiskBadge, RiskScore, EmotionBadge } from '@/components/shared/Badges';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Headphones,
  RotateCcw,
  Repeat,
  XCircle,
  Bug,
  Heart,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import type { Message, AnalysisResult } from '@/lib/types';

// ─── Mock Analysis Engine ──────────────────────────────────
function analyzeConversation(messages: Message[]): AnalysisResult {
  const userMessages = messages.filter((m) => m.role === 'user');
  const allText = userMessages.map((m) => m.text.toLowerCase()).join(' ');

  // Simple signal detection
  const urgencyWords = ['now', 'immediately', 'asap', 'urgent', 'critical', 'emergency', 'losing', 'loss', 'revenue'];
  const negativeWords = ['frustrated', 'angry', 'unacceptable', 'terrible', 'worst', 'hate', 'useless', 'broken', 'failed', 'not working', 'bug', 'error', 'crash'];
  const repetitionWords = ['again', 'still', 'keeps', 'recurring', 'third time', 'second time', 'same issue', 'same problem'];
  const technicalWords = ['api', 'server', 'database', 'error', 'crash', '500', '502', '404', 'timeout', 'latency', 'bug'];
  const escalationWords = ['manager', 'supervisor', 'escalate', 'legal', 'cancel', 'switch', 'competitor', 'alternative'];

  const urgencyScore = urgencyWords.filter((w) => allText.includes(w)).length;
  const negativeScore = negativeWords.filter((w) => allText.includes(w)).length;
  const repetitionScore = repetitionWords.filter((w) => allText.includes(w)).length;
  const technicalScore = technicalWords.filter((w) => allText.includes(w)).length;
  const escalationScore = escalationWords.filter((w) => allText.includes(w)).length;

  // Calculate overall risk
  const rawRisk =
    (urgencyScore * 0.15 +
      negativeScore * 0.12 +
      repetitionScore * 0.18 +
      technicalScore * 0.08 +
      escalationScore * 0.25 +
      Math.min(userMessages.length * 0.05, 0.3)) /
    1;
  const risk = Math.min(Math.max(rawRisk, 0.05), 0.98);

  // Determine priority
  const priority = risk >= 0.8 ? 'P1' : risk >= 0.5 ? 'P2' : 'P3';

  // Determine emotion
  const emotion =
    escalationScore > 0 || negativeScore > 3
      ? 'ANGRY'
      : negativeScore > 1
      ? 'FRUSTRATED'
      : repetitionScore > 0
      ? 'CONFUSED'
      : risk < 0.2
      ? 'SATISFIED'
      : 'NEUTRAL';

  // Root cause
  const root_cause =
    repetitionScore > 0
      ? 'REPEATED_ISSUE'
      : technicalScore > 1
      ? 'TECHNICAL_ISSUE'
      : negativeScore > 2
      ? 'POOR_COMMUNICATION'
      : risk > 0.5
      ? 'RESOLUTION_FAILURE'
      : 'NONE';

  // Build explanations
  const explanation: string[] = [];
  if (urgencyScore > 0) explanation.push(`Urgency language detected (${urgencyScore} indicators)`);
  if (negativeScore > 0) explanation.push(`Negative sentiment detected (${negativeScore} indicators)`);
  if (repetitionScore > 0) explanation.push('Issue repetition/recurrence mentioned');
  if (technicalScore > 0) explanation.push('Technical issue signals present');
  if (escalationScore > 0) explanation.push('Explicit escalation request detected');
  if (userMessages.length > 4) explanation.push('Extended conversation without resolution');
  if (explanation.length === 0) explanation.push('No significant risk signals detected');

  // Suggested actions
  const suggested_actions: string[] = [];
  if (risk >= 0.8) suggested_actions.push('Escalate to L3 support immediately');
  if (technicalScore > 0) suggested_actions.push('Check system logs and service status');
  if (repetitionScore > 0) suggested_actions.push('Review previous ticket history');
  if (urgencyScore > 0) suggested_actions.push('Provide immediate ETA for resolution');
  if (negativeScore > 2) suggested_actions.push('Consider assigning senior agent');
  if (suggested_actions.length === 0) suggested_actions.push('Continue monitoring conversation');

  return {
    risk: +risk.toFixed(2),
    priority,
    predicted_escalation: risk >= 0.6,
    detection_point: Math.min(userMessages.length, messages.length),
    emotion,
    root_cause,
    signals: {
      repetition: repetitionScore,
      resolution_failure: risk > 0.5 && userMessages.length > 3,
      technical_issue: technicalScore > 0,
      sentiment_score: +(0.5 - negativeScore * 0.15 - urgencyScore * 0.1).toFixed(2),
      urgency: urgencyScore > 0,
    },
    explanation,
    suggested_actions,
  };
}

// ─── Signal Card Component ─────────────────────────────────
function SignalCard({
  icon: Icon,
  label,
  active,
  value,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  value: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-2.5 transition-all ${
        active
          ? 'border-blue-500/20 bg-blue-500/5'
          : 'border-white/[0.04] bg-white/[0.02]'
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-md ${
          active ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.04] text-slate-600'
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 truncate">{label}</p>
        <p className={`text-xs font-medium ${active ? 'text-blue-400' : 'text-slate-500'}`}>{value}</p>
      </div>
      <div className={`h-2 w-2 rounded-full ${active ? 'bg-blue-400' : 'bg-white/[0.06]'}`} />
    </div>
  );
}

// ─── Main Chat Page ────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState<'user' | 'agent'>('user');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      role,
      text: input.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    // Run analysis
    const result = analyzeConversation(updatedMessages);
    setAnalysis(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setAnalysis(null);
    setInput('');
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Conversation Simulator</h2>
          <p className="text-xs text-slate-500">Simulate support conversations and observe real-time escalation analysis</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
        {/* Chat Window — Left Panel */}
        <Card className="lg:col-span-3 flex flex-col border-white/[0.06] bg-[#111827] overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Start a Conversation</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Type a message as a User or Agent to simulate a support conversation. The AI analyzer will evaluate risk in real-time.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-xl px-3.5 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'bg-white/[0.04] border border-white/[0.06]'
                    }`}
                  >
                    <p className="text-sm text-slate-200 leading-relaxed">{msg.text}</p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {/* Detection marker */}
                  {analysis && analysis.detection_point === i + 1 && analysis.predicted_escalation && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="self-center"
                    >
                      <div className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5">
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                        <span className="text-[10px] text-red-400 font-medium">Detection Point</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Speaking as:</span>
              <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setRole('user')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                    role === 'user'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <User className="h-3 w-3" />
                  Customer
                </button>
                <button
                  onClick={() => setRole('agent')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                    role === 'agent'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Headphones className="h-3 w-3" />
                  Agent
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Type a message as ${role === 'user' ? 'customer' : 'agent'}...`}
                className="min-h-[44px] max-h-[120px] resize-none border-white/[0.06] bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-600"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-[44px] w-[44px] shrink-0 bg-blue-600 hover:bg-blue-500 disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Analysis Panel — Right Panel */}
        <Card className="lg:col-span-2 flex flex-col border-white/[0.06] bg-[#111827] overflow-y-auto">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Live Analysis</h3>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time escalation risk assessment</p>
          </div>

          {!analysis ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-xs text-slate-500">Send messages to see live analysis</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4 flex-1">
              {/* Risk Score */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">Escalation Risk</span>
                  <RiskBadge priority={analysis.priority} />
                </div>
                <div className="flex items-end gap-3">
                  <motion.span
                    key={analysis.risk}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className={`text-3xl font-bold font-mono ${
                      analysis.risk >= 0.8
                        ? 'text-red-400'
                        : analysis.risk >= 0.5
                        ? 'text-amber-400'
                        : 'text-green-400'
                    }`}
                  >
                    {(analysis.risk * 100).toFixed(0)}%
                  </motion.span>
                  <span className="text-xs text-slate-500 mb-1">risk score</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.risk * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      analysis.risk >= 0.8
                        ? 'bg-gradient-to-r from-red-600 to-red-400'
                        : analysis.risk >= 0.5
                        ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                        : 'bg-gradient-to-r from-green-600 to-green-400'
                    }`}
                  />
                </div>
              </div>

              {/* Prediction & Emotion */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-[10px] text-slate-500 mb-1">Escalation Predicted</p>
                  <span
                    className={`text-sm font-bold ${
                      analysis.predicted_escalation ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {analysis.predicted_escalation ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-[10px] text-slate-500 mb-1">Emotion</p>
                  <EmotionBadge emotion={analysis.emotion} />
                </div>
              </div>

              {/* Signals */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Detected Signals</p>
                <div className="space-y-1.5">
                  <SignalCard
                    icon={Repeat}
                    label="Repetition"
                    active={analysis.signals.repetition > 0}
                    value={analysis.signals.repetition > 0 ? `${analysis.signals.repetition} found` : 'None'}
                  />
                  <SignalCard
                    icon={XCircle}
                    label="Resolution Failure"
                    active={analysis.signals.resolution_failure}
                    value={analysis.signals.resolution_failure ? 'Detected' : 'None'}
                  />
                  <SignalCard
                    icon={Bug}
                    label="Technical Issue"
                    active={analysis.signals.technical_issue}
                    value={analysis.signals.technical_issue ? 'Detected' : 'None'}
                  />
                  <SignalCard
                    icon={Heart}
                    label="Sentiment"
                    active={analysis.signals.sentiment_score < 0}
                    value={`${analysis.signals.sentiment_score > 0 ? '+' : ''}${analysis.signals.sentiment_score.toFixed(2)}`}
                  />
                  <SignalCard
                    icon={AlertTriangle}
                    label="Urgency"
                    active={analysis.signals.urgency}
                    value={analysis.signals.urgency ? 'High' : 'Normal'}
                  />
                </div>
              </div>

              {/* Explanation */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Explanation</p>
                <div className="space-y-1.5">
                  {analysis.explanation.map((exp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5 shrink-0" />
                      <span>{exp}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggested Actions */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                  <p className="text-xs font-medium text-slate-400">Suggested Actions</p>
                </div>
                <div className="space-y-1.5">
                  {analysis.suggested_actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-2"
                    >
                      <p className="text-xs text-amber-200">{action}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Root Cause */}
              <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                <p className="text-[10px] text-slate-500 mb-1">Root Cause</p>
                <p className="text-xs font-medium text-slate-200">
                  {analysis.root_cause.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}
