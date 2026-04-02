'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { MOCK_EVALUATION_METRICS } from '@/lib/mock-data';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { motion } from 'framer-motion';
import { Target, Crosshair, Gauge, Clock, AlertCircle, TrendingUp, Award } from 'lucide-react';
import dynamic from 'next/dynamic';

const ROCChart = dynamic(() => import('@/components/evaluation/ROCChart'), { ssr: false });

const metrics = MOCK_EVALUATION_METRICS;

export default function EvaluationPage() {
  const metricCards = [
    { label: 'Precision', value: metrics.precision, icon: Crosshair, color: 'from-blue-500 to-blue-600', desc: 'Of predicted escalations, how many were correct' },
    { label: 'Recall', value: metrics.recall, icon: Target, color: 'from-green-500 to-green-600', desc: 'Of actual escalations, how many were caught' },
    { label: 'F1 Score', value: metrics.f1_score, icon: Award, color: 'from-purple-500 to-purple-600', desc: 'Harmonic mean of precision and recall' },
    { label: 'Accuracy', value: metrics.accuracy, icon: Gauge, color: 'from-cyan-500 to-cyan-600', desc: 'Overall correct predictions' },
    { label: 'Early Detection', value: metrics.early_detection_score, icon: Clock, color: 'from-amber-500 to-amber-600', desc: 'Predictions made before actual escalation' },
    { label: 'False Positive Rate', value: metrics.false_positive_rate, icon: AlertCircle, color: 'from-red-500 to-red-600', desc: 'False alarms out of total negatives' },
  ];

  const cm = metrics.confusion_matrix;
  const cmTotal = cm.tp + cm.fp + cm.fn + cm.tn;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Model Evaluation</h2>
          <p className="text-xs text-slate-500">Performance metrics for the escalation detection model</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-green-400" />
          <span className="text-xs font-medium text-green-400">Model v2.1 — Production</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((metric, i) => {
          const Icon = metric.icon;
          const isLow = metric.label === 'False Positive Rate';
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-white/[0.06] bg-[#111827] p-4 hover:border-white/[0.12] transition-all">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${metric.color} mb-3`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  <AnimatedCounter
                    value={metric.value * 100}
                    decimals={1}
                    suffix="%"
                  />
                </div>
                <p className="text-xs font-medium text-slate-300 mt-1">{metric.label}</p>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{metric.desc}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <Card className="border-white/[0.06] bg-[#111827] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Confusion Matrix</h3>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[360px]">
              {/* Labels */}
              <div className="flex items-center justify-center mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Predicted</span>
              </div>
              <div className="flex gap-3">
                {/* Y-axis label */}
                <div className="flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider -rotate-90 whitespace-nowrap">
                    Actual
                  </span>
                </div>
                {/* Matrix Grid */}
                <div className="flex-1 grid grid-cols-2 gap-2">
                  {/* Header row */}
                  <div className="text-center text-[10px] text-slate-500 pb-1">Escalation</div>
                  <div className="text-center text-[10px] text-slate-500 pb-1">No Escalation</div>

                  {/* TP */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center aspect-square flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl font-bold font-mono text-green-400">{cm.tp}</span>
                    <span className="text-[10px] text-green-400/60 mt-1">True Positives</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">{((cm.tp / cmTotal) * 100).toFixed(1)}%</span>
                  </motion.div>

                  {/* FN */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center aspect-square flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl font-bold font-mono text-red-400">{cm.fn}</span>
                    <span className="text-[10px] text-red-400/60 mt-1">False Negatives</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">{((cm.fn / cmTotal) * 100).toFixed(1)}%</span>
                  </motion.div>

                  {/* FP */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center aspect-square flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl font-bold font-mono text-amber-400">{cm.fp}</span>
                    <span className="text-[10px] text-amber-400/60 mt-1">False Positives</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">{((cm.fp / cmTotal) * 100).toFixed(1)}%</span>
                  </motion.div>

                  {/* TN */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-center aspect-square flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl font-bold font-mono text-blue-400">{cm.tn}</span>
                    <span className="text-[10px] text-blue-400/60 mt-1">True Negatives</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">{((cm.tn / cmTotal) * 100).toFixed(1)}%</span>
                  </motion.div>
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-600 mt-3">Total samples: {cmTotal}</p>
            </div>
          </div>
        </Card>

        {/* ROC Curve */}
        <Card className="border-white/[0.06] bg-[#111827] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">ROC Curve</h3>
            <span className="text-xs font-mono text-blue-400">AUC = 0.96</span>
          </div>
          <div className="h-[300px]">
            <ROCChart data={metrics.roc_data} />
          </div>
        </Card>
      </div>

      {/* Early Detection Timeline */}
      <Card className="border-white/[0.06] bg-[#111827] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Early Detection Performance</h3>
          <span className="text-xs text-slate-500">— How early does the model detect escalations?</span>
        </div>
        <div className="space-y-3">
          {metrics.detection_points.map((dp, i) => {
            const earlyTurns = dp.actual_turn - dp.predicted_turn;
            const earlyPercent = ((earlyTurns / dp.actual_turn) * 100).toFixed(0);
            return (
              <motion.div
                key={dp.conversation_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
              >
                <span className="text-xs font-mono text-slate-500 w-20 shrink-0">{dp.conversation_id}</span>
                <div className="flex-1">
                  <div className="relative h-6 rounded-full bg-white/[0.04] overflow-hidden">
                    {/* Full conversation length */}
                    <div className="absolute inset-0 flex items-center px-2">
                      {Array.from({ length: dp.actual_turn + 1 }, (_, t) => (
                        <div key={t} className="flex-1 flex items-center justify-center">
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            t + 1 === dp.predicted_turn
                              ? 'bg-green-400 ring-2 ring-green-400/30'
                              : t + 1 === dp.actual_turn
                              ? 'bg-red-400 ring-2 ring-red-400/30'
                              : 'bg-white/[0.1]'
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500">Predicted: </span>
                    <span className="text-xs font-mono text-green-400">Turn {dp.predicted_turn}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500">Actual: </span>
                    <span className="text-xs font-mono text-red-400">Turn {dp.actual_turn}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400">
                    {earlyPercent}% early
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </PageWrapper>
  );
}
