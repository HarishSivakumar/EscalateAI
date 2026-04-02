'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface FailureBreakdownChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function FailureBreakdownChart({ data }: FailureBreakdownChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-6 h-full">
      <div className="flex-1 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F9FAFB',
              }}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2.5 min-w-[140px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-300 truncate">{item.name}</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
