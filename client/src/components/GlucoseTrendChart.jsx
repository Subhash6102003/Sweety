import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';

export const GlucoseTrendChart = ({ trendData = [] }) => {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="rounded-3xl border border-theme-border bg-white p-6 shadow-xs min-h-[340px] flex flex-col items-center justify-center text-center">
        <span className="text-sm font-semibold text-gray-400">No trend data available for this range</span>
        <span className="text-xs text-gray-400 mt-1">Log readings across days to see your glucose trend curve</span>
      </div>
    );
  }

  // Format data for chart
  const formattedData = trendData.map((d, index) => {
    const dateObj = new Date(d.reading_date);
    const dayMonth = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      index,
      displayDate: dayMonth,
      fullDate: d.reading_date,
      slot: d.slot,
      value: d.value
    };
  });

  return (
    <div className="rounded-3xl border border-theme-border bg-white p-6 shadow-xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div>
          <h3 className="font-display font-bold text-base text-gray-900">
            Glucose Trend Curve (Last 30 Days)
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Continuous readings relative to the 70–140 mg/dL clinical target window
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-semibold text-gray-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Target (70-140)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-theme-primary" />
            <span>Recorded Glucose</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-line)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--chart-line)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[40, 260]}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-xl border border-gray-100 text-xs">
                      <div className="font-bold text-gray-900">{data.fullDate}</div>
                      <div className="text-[11px] text-gray-500">{data.slot}</div>
                      <div className="text-base font-extrabold text-theme-primary mt-1">
                        {data.value} <span className="text-xs font-semibold text-gray-400">mg/dL</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Target Range Reference Lines */}
            <ReferenceLine y={140} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine y={70} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-line)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#glucoseGradient)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
