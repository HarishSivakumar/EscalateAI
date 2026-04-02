'use client';

import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TimeSeriesPoint } from '@/lib/types';

interface RiskProgressionChartProps {
  riskData: TimeSeriesPoint[];
  volumeData: TimeSeriesPoint[];
}

export default function RiskProgressionChart({ riskData, volumeData }: RiskProgressionChartProps) {
  const combined = riskData.map((d, i) => ({
    date: d.date,
    risk: d.value,
    volume: volumeData[i]?.value || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={combined} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="riskLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
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
          yAxisId="risk"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#6B7280' }}
          domain={[0, 1]}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <YAxis
          yAxisId="volume"
          orientation="right"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#6B7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#F9FAFB',
          }}
          labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <Line
          yAxisId="risk"
          type="monotone"
          dataKey="risk"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
          name="Risk Score"
        />
        <Line
          yAxisId="volume"
          type="monotone"
          dataKey="volume"
          stroke="#8B5CF6"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          name="Conv. Volume"
          opacity={0.6}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
