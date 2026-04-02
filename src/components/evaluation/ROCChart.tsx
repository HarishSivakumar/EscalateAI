'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';

interface ROCChartProps {
  data: { fpr: number; tpr: number }[];
}

export default function ROCChart({ data }: ROCChartProps) {
  const diagonalData = [
    { fpr: 0, tpr: 0 },
    { fpr: 1, tpr: 1 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="fpr"
          type="number"
          domain={[0, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#6B7280' }}
          tickFormatter={(v) => v.toFixed(1)}
          label={{ value: 'False Positive Rate', position: 'bottom', offset: -5, fontSize: 10, fill: '#6B7280' }}
        />
        <YAxis
          dataKey="tpr"
          type="number"
          domain={[0, 1]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#6B7280' }}
          tickFormatter={(v) => v.toFixed(1)}
          label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: '#6B7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#F9FAFB',
          }}
          formatter={(value) => [Number(value).toFixed(3)]}
        />
        {/* Diagonal (random classifier) */}
        <Line
          data={diagonalData}
          type="linear"
          dataKey="tpr"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          legendType="none"
        />
        {/* ROC Curve */}
        <Line
          data={data}
          type="monotone"
          dataKey="tpr"
          stroke="#3B82F6"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
