import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const GlycemicDistributionChart = ({ distribution }) => {
  const low = distribution?.low_count || 0;
  const inTarget = distribution?.in_target_count || 0;
  const high = distribution?.high_count || 0;
  const total = low + inTarget + high;

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-theme-border bg-white p-6 shadow-xs min-h-[340px] flex flex-col items-center justify-center text-center">
        <span className="text-sm font-semibold text-gray-400">No distribution data for this month</span>
        <span className="text-xs text-gray-400 mt-1">Logs will categorize into In Target, Elevated, and Low</span>
      </div>
    );
  }

  const data = [
    { name: 'In Target (70-140)', value: inTarget, color: '#10b981' },
    { name: 'Elevated (>140)', value: high, color: '#f59e0b' },
    { name: 'Low (<70)', value: low, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const inTargetPercent = total > 0 ? Math.round((inTarget / total) * 100) : 0;

  return (
    <div className="rounded-3xl border border-theme-border bg-white p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="pb-4 border-b border-gray-100">
        <h3 className="font-display font-bold text-base text-gray-900">
          Glycemic Target Distribution
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Proportion of readings in healthy range this month
        </p>
      </div>

      {/* Donut Chart with Center Metric */}
      <div className="relative h-56 w-full my-auto flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const percent = Math.round((item.value / total) * 100);
                  return (
                    <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-lg border border-gray-100 text-xs">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-sm font-extrabold text-theme-primary mt-0.5">
                        {item.value} logs ({percent}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-extrabold text-gray-900 tabular-nums">
            {inTargetPercent}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            In Target
          </span>
        </div>
      </div>

      {/* Breakdown Legend */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
        <div className="p-1">
          <span className="text-[10px] font-bold text-emerald-600 block">In Target</span>
          <span className="text-sm font-extrabold text-gray-900 tabular-nums">{inTarget}</span>
        </div>
        <div className="p-1">
          <span className="text-[10px] font-bold text-amber-600 block">Elevated</span>
          <span className="text-sm font-extrabold text-gray-900 tabular-nums">{high}</span>
        </div>
        <div className="p-1">
          <span className="text-[10px] font-bold text-rose-600 block">Low</span>
          <span className="text-sm font-extrabold text-gray-900 tabular-nums">{low}</span>
        </div>
      </div>
    </div>
  );
};
