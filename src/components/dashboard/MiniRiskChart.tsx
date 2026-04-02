'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TimeSeriesPoint } from '@/lib/types';

interface MiniRiskChartProps {
  data: TimeSeriesPoint[];
}

export default function MiniRiskChart({ data }: MiniRiskChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#6B7280' }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
          interval={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#6B7280' }}
          domain={[0, 1]}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#F9FAFB',
          }}
          labelFormatter={(label) => {
            const d = new Date(label);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
          formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Risk Score']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#riskGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
