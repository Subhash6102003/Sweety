import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Filter, Activity, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AmbulatoryGlucoseProfileChart = ({ trendData = [], onOpenLog }) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';

  // Demo fallback data matching Stitch telemetry
  const DEMO_CHART_DATA = [
    { day: 'Mon 18', avg: 122, range: [95, 140], isSpike: false },
    { day: 'Tue 19', avg: 128, range: [98, 142], isSpike: false },
    { day: 'Wed 20', avg: 119, range: [94, 138], isSpike: false },
    { day: 'Thu 21', avg: 158, range: [110, 158], isSpike: true },
    { day: 'Fri 22', avg: 124, range: [99, 140], isSpike: false },
    { day: 'Sat 23', avg: 130, range: [102, 145], isSpike: false },
    { day: 'Today', avg: 125, range: [99, 142], isSpike: false }
  ];

  // If real user has real readings, compute real daily averages from Supabase
  let chartData = [];
  if (isDemo) {
    chartData = DEMO_CHART_DATA;
  } else if (trendData && trendData.length > 0) {
    // Group by reading_date
    const grouped = {};
    trendData.forEach(r => {
      const d = r.reading_date;
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(r.value);
    });

    chartData = Object.entries(grouped).map(([dateStr, vals]) => {
      const sum = vals.reduce((a, b) => a + b, 0);
      const avg = Math.round(sum / vals.length);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const dObj = new Date(dateStr + 'T00:00:00');
      const label = dObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      return {
        day: label,
        avg,
        range: [min, max],
        isSpike: max > 140
      };
    });
  }

  const hasData = chartData.length > 0;

  return (
    <div id="tour-agp-chart" className="p-3.5 sm:p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between min-w-0 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md border-b border-outline-variant/30 gap-space-sm mb-space-md">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-headline-sm text-base sm:text-headline-sm text-on-surface font-bold">
              Ambulatory Glucose Profile (AGP)
            </h2>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] font-semibold">
              {isDemo ? 'Demo Telemetry (7 Days)' : hasData ? 'Past 30 Days' : 'Real-Time Telemetry'}
            </span>
          </div>
          <p className="font-body-sm text-xs text-outline mt-0.5">
            Continuous telemetry calibrated against clinical 70–140 mg/dL target zone
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-xs hover:bg-surface-container transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-outline" />
            <span>Filter</span>
          </button>
          <span className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-xs">
            {hasData ? `${chartData.length} Logged Days` : 'Awaiting Data'}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-surface-container-low/40 rounded-xl p-2 sm:p-4 flex flex-col justify-between overflow-hidden min-w-0">
        
        {/* Thursday Post-Lunch Excursion Popover Badge - Only for Demo Account */}
        {isDemo && (
          <div className="absolute top-2 left-[50%] -translate-x-1/2 z-20 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg text-[10px] sm:text-[11px] pointer-events-none flex flex-col items-start border border-outline-variant/30 max-w-[92vw] sm:max-w-none">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-label-sm text-label-sm text-primary-fixed-dim font-bold">Thu, Oct 21</span>
              <span className="font-label-sm text-label-sm text-error-container font-semibold">Elevated</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
              <span className="font-label-md text-label-md font-bold text-white tabular-nums">158 mg/dL</span>
              <span className="font-label-sm text-[10px] sm:text-xs text-inverse-on-surface/80">
                • Post-Lunch (+38) • 1:30 PM Spike
              </span>
            </div>
            <div className="w-2 h-2 bg-inverse-surface rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
        )}

        {/* Target Corridor Legend Badge */}
        <div className="absolute right-2 sm:right-4 top-2 sm:top-3 z-10 hidden sm:block">
          <span className="font-label-sm text-[11px] text-tertiary font-medium bg-surface-container-lowest/90 px-2 py-0.5 rounded shadow-xs border border-tertiary/20">
            Target Corridor (70–140 mg/dL)
          </span>
        </div>

        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 30, right: 15, left: -20, bottom: 0 }}>
              {/* Target corridor overlay: 70–140 mg/dL translucent band */}
              <ReferenceArea
                y1={70}
                y2={140}
                fill="#106854"
                fillOpacity={0.08}
              />

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0bfbe" strokeOpacity={0.4} />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: '#e0bfbe' }}
                tick={{ fill: '#8c7070', fontSize: 11, fontWeight: 600 }}
              />

              <YAxis
                domain={[40, 200]}
                ticks={[40, 70, 100, 140, 160, 200]}
                tickLine={false}
                axisLine={{ stroke: '#e0bfbe' }}
                tick={{ fill: '#8c7070', fontSize: 10, fontWeight: 600 }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-xl border border-outline-variant/40 text-xs">
                        <div className="font-bold text-on-surface">{data.day}</div>
                        <div className="text-sm font-extrabold text-primary mt-0.5 tabular-nums">
                          {data.avg} mg/dL
                        </div>
                        <div className="text-[10px] text-outline mt-0.5">
                          Range: {data.range[0]} – {data.range[1]} mg/dL
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Target Corridor Reference Boundaries */}
              <ReferenceLine y={140} stroke="#106854" strokeDasharray="4 4" strokeWidth={1.5} />
              <ReferenceLine y={70} stroke="#106854" strokeDasharray="4 4" strokeWidth={1.5} />

              {/* 50th Percentile Median AGP Curve */}
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#ad2737"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ad2737', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#ad2737' }}
              />

              {/* Shaded Area for Interquartile Range */}
              <Area
                type="monotone"
                dataKey="avg"
                fill="#ad2737"
                fillOpacity={0.08}
                stroke="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-on-surface">No Telemetry Recorded Yet</h4>
              <p className="text-xs text-outline max-w-sm mt-1">
                Your ambulatory glucose profile will plot here automatically once you log daily checkpoints or sync sensor data.
              </p>
            </div>
            {onOpenLog && (
              <button
                type="button"
                onClick={onOpenLog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log First Reading</span>
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
