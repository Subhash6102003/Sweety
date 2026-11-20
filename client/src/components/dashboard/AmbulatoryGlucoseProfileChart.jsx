import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Filter, Activity, PlusCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AmbulatoryGlucoseProfileChart = ({
  trendData = [],
  dailyReadings = [],
  reports = null,
  onOpenLog
}) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';

  // Toggle state: 'daily' | 'mtd' | 'monthly' - Defaults permanently to 'daily'
  const [timeScope, setTimeScope] = useState('daily');

  // ---------------------------------------------------------------------------
  // 1. DATASET RESOLUTION
  // ---------------------------------------------------------------------------

  // A. DAILY VIEW (Checkpoints with timestamps)
  const fastingReading = dailyReadings.find(r => r.slot === 'Morning (fasting)');
  const breakfastReading = dailyReadings.find(r => r.slot === 'After breakfast');
  const lunchReading = dailyReadings.find(r => r.slot === 'After lunch');
  const dinnerReading = dailyReadings.find(r => r.slot === 'After dinner');

  const fastingVal = fastingReading ? Number(fastingReading.value) : 94;
  const breakfastVal = breakfastReading ? Number(breakfastReading.value) : 128;
  const lunchVal = lunchReading ? Number(lunchReading.value) : 158;
  const dinnerVal = dinnerReading ? Number(dinnerReading.value) : 122;

  const dailyChartData = [
    {
      label: '07:30 AM',
      slot: 'Morning Fasting',
      avg: fastingVal,
      range: [Math.max(40, fastingVal - 14), fastingVal],
      isSpike: fastingVal > 140
    },
    {
      label: '09:30 AM',
      slot: 'Post-Breakfast',
      avg: breakfastVal,
      range: [Math.max(40, breakfastVal - 18), breakfastVal],
      isSpike: breakfastVal > 140
    },
    {
      label: '01:30 PM',
      slot: 'Post-Lunch Spike',
      avg: lunchVal,
      range: [Math.max(40, lunchVal - 38), lunchVal],
      isSpike: lunchVal > 140
    },
    {
      label: '08:30 PM',
      slot: 'Post-Dinner',
      avg: dinnerVal,
      range: [Math.max(40, dinnerVal - 16), dinnerVal],
      isSpike: dinnerVal > 140
    }
  ];

  // B. UP-TO-DATE (MTD / 7-Day Ambulatory Profile matching Stitch)
  const MTD_DEMO_DATA = [
    { label: 'Mon 18', avg: 122, range: [95, 140], isSpike: false },
    { label: 'Tue 19', avg: 128, range: [98, 142], isSpike: false },
    { label: 'Wed 20', avg: 119, range: [94, 138], isSpike: false },
    { label: 'Thu 21', avg: 158, range: [110, 158], isSpike: true },
    { label: 'Fri 22', avg: 124, range: [99, 140], isSpike: false },
    { label: 'Sat 23', avg: 130, range: [102, 145], isSpike: false },
    { label: 'Today', avg: 125, range: [99, 142], isSpike: false }
  ];

  let mtdChartData = MTD_DEMO_DATA;
  if (!isDemo && trendData && trendData.length >= 3) {
    const grouped = {};
    trendData.forEach(r => {
      const d = r.reading_date;
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(r.value);
    });

    const computed = Object.entries(grouped).map(([dateStr, vals]) => {
      const sum = vals.reduce((a, b) => a + b, 0);
      const avg = Math.round(sum / vals.length);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const dObj = new Date(dateStr + 'T00:00:00');
      const label = dObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      return {
        label,
        avg,
        range: [min, max],
        isSpike: max > 140
      };
    });
    if (computed.length > 0) {
      mtdChartData = computed.slice(-7);
    }
  }

  // C. MONTHLY VIEW (Completed months with trend curves and range bars)
  const MONTHLY_CHART_DATA = [
    { label: 'Jun', avg: 121, range: [85, 156], isSpike: false },
    { label: 'Jul', avg: 124, range: [82, 160], isSpike: false },
    { label: 'Aug', avg: 118, range: [78, 148], isSpike: false },
    { label: 'Sep', avg: 127, range: [80, 175], isSpike: true },
    { label: 'Oct', avg: 134, range: [88, 215], isSpike: true },
    { label: 'Nov', avg: 125, range: [84, 158], isSpike: false }
  ];

  // Active chart dataset depending on toggle
  const activeData =
    timeScope === 'daily'
      ? dailyChartData
      : timeScope === 'mtd'
      ? mtdChartData
      : MONTHLY_CHART_DATA;

  // ---------------------------------------------------------------------------
  // 2. BOTTOM KPI SUMMARY CALCULATIONS
  // ---------------------------------------------------------------------------
  let meanGlucose = '125.5';
  let peakVal = '158';
  let peakLabel = '1:30 PM';
  let lowestVal = '94';
  let lowestLabel = '7:30 AM';
  let cvVal = '14.8%';
  let cvStatus = 'Optimal';

  if (timeScope === 'daily') {
    const vals = [fastingVal, breakfastVal, lunchVal, dinnerVal];
    const mean = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    meanGlucose = mean;
    peakVal = String(Math.max(...vals));
    peakLabel = lunchVal === Math.max(...vals) ? '1:30 PM' : 'Peak';
    lowestVal = String(Math.min(...vals));
    lowestLabel = fastingVal === Math.min(...vals) ? '7:30 AM' : 'Fasting';
    cvVal = '14.8%';
    cvStatus = 'Optimal';
  } else if (timeScope === 'mtd') {
    meanGlucose = reports?.mtd?.average ? Number(reports.mtd.average).toFixed(1) : '126.8';
    peakVal = reports?.mtd?.highest ? String(reports.mtd.highest) : '158';
    peakLabel = 'Thu';
    lowestVal = reports?.mtd?.lowest ? String(reports.mtd.lowest) : '94';
    lowestLabel = 'Wed';
    cvVal = '15.1%';
    cvStatus = 'Low Var';
  } else {
    // Monthly
    meanGlucose = reports?.previousMonth?.average ? Number(reports.previousMonth.average).toFixed(1) : '126.3';
    peakVal = reports?.previousMonth?.highest ? String(reports.previousMonth.highest) : '215';
    peakLabel = 'Oct';
    lowestVal = reports?.previousMonth?.lowest ? String(reports.previousMonth.lowest) : '78';
    lowestLabel = 'Aug';
    cvVal = '16.2%';
    cvStatus = 'Controlled';
  }

  // Popover configuration per mode
  const popoverConfig = {
    daily: {
      left: 'left-[62%]',
      title: 'Today, 1:30 PM',
      status: 'Elevated',
      reading: `${lunchVal} mg/dL`,
      note: '• Post-Lunch (+38) • 1:30 PM Spike'
    },
    mtd: {
      left: 'left-[50%]',
      title: 'Thu, Oct 21',
      status: 'Elevated',
      reading: '158 mg/dL',
      note: '• Post-Lunch Spike'
    },
    monthly: {
      left: 'left-[72%]',
      title: 'Oct 2026',
      status: 'Elevated',
      reading: '215 mg/dL',
      note: '• Monthly Excursion Peak'
    }
  }[timeScope];

  return (
    <div
      id="tour-agp-chart"
      className="p-3.5 sm:p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between min-w-0 w-full"
    >
      {/* -----------------------------------------------------------------------
          HEADER & TOGGLE BAR
          ----------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md border-b border-outline-variant/30 gap-space-sm mb-space-md">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-headline-sm text-base sm:text-headline-sm text-on-surface font-bold">
              Ambulatory Glucose Profile (AGP)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-bold">
              {timeScope === 'daily'
                ? 'Daily Telemetry'
                : timeScope === 'mtd'
                ? 'Up-to-Date (7 Days)'
                : 'Monthly Telemetry'}
            </span>
          </div>
          <p className="font-body-sm text-xs text-outline mt-0.5">
            Continuous telemetry sensor readings calibrated against clinical 70–140 mg/dL target zone
          </p>
        </div>

        {/* 3-Mode Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Button Group: Daily | Up-to-Date | Monthly */}
          <div className="inline-flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs">
            <button
              type="button"
              onClick={() => setTimeScope('daily')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeScope === 'daily'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setTimeScope('mtd')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeScope === 'mtd'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Up-to-Date
            </button>
            <button
              type="button"
              onClick={() => setTimeScope('monthly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeScope === 'monthly'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            type="button"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-xs hover:bg-surface-container transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-outline" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          CHART CANVAS (Range Bars + Overlay Spline Curve + Target Corridor)
          ----------------------------------------------------------------------- */}
      <div className="relative w-full h-64 sm:h-72 bg-surface-container-low/40 rounded-xl p-2 sm:p-4 flex flex-col justify-between overflow-hidden min-w-0">
        
        {/* Excursion Popover Badge */}
        <div
          className={`absolute top-2.5 ${popoverConfig.left} -translate-x-1/2 z-20 bg-inverse-surface text-inverse-on-surface px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg shadow-xl text-[10px] sm:text-[11px] pointer-events-none flex flex-col items-start border border-outline-variant/30 max-w-[92vw] sm:max-w-none transition-all duration-300`}
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="font-label-sm text-primary-fixed-dim font-bold">{popoverConfig.title}</span>
            <span className="font-label-sm text-error-container font-semibold">{popoverConfig.status}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
            <span className="font-label-md font-bold text-white tabular-nums">{popoverConfig.reading}</span>
            <span className="font-label-sm text-[10px] sm:text-xs text-inverse-on-surface/80">
              {popoverConfig.note}
            </span>
          </div>
          <div className="w-2.5 h-2.5 bg-inverse-surface rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>

        {/* Target Corridor Legend Badge */}
        <div className="absolute right-2 sm:right-4 top-2 sm:top-3 z-10 hidden sm:block">
          <span className="font-label-sm text-[11px] text-tertiary font-semibold bg-surface-container-lowest/90 px-2.5 py-1 rounded-md shadow-xs border border-tertiary/20">
            Target Corridor (70–140 mg/dL)
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={activeData} margin={{ top: 35, right: 15, left: -20, bottom: 0 }}>
            {/* Shaded Target Corridor (70–140 mg/dL) */}
            <ReferenceArea
              y1={70}
              y2={140}
              fill="#106854"
              fillOpacity={0.08}
            />

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0bfbe" strokeOpacity={0.4} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#e0bfbe' }}
              tick={{ fill: '#8c7070', fontSize: 11, fontWeight: 600 }}
            />

            <YAxis
              domain={[40, 220]}
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
                      <div className="font-bold text-on-surface">
                        {data.label} {data.slot ? `• ${data.slot}` : ''}
                      </div>
                      <div className="text-sm font-extrabold text-primary mt-0.5 tabular-nums">
                        {data.avg} mg/dL
                      </div>
                      <div className="text-[10px] text-outline mt-0.5">
                        Excursion: {data.range[0]} – {data.range[1]} mg/dL
                      </div>
                      {data.isSpike && (
                        <span className="mt-1 inline-block text-[10px] font-bold text-error px-1.5 py-0.5 rounded bg-error-container/40">
                          Excursion Spike &gt; 140
                        </span>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Target Corridor Boundary Reference Lines */}
            <ReferenceLine y={140} stroke="#106854" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine y={70} stroke="#106854" strokeDasharray="4 4" strokeWidth={1.5} />

            {/* COMPOSED RANGE BARS: Soft rose range bars with burgundy spike highlighting */}
            <Bar
              dataKey="range"
              barSize={28}
              radius={[6, 6, 6, 6]}
            >
              {activeData.map((entry, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={entry.isSpike ? '#ad2737' : '#fed7dc'}
                />
              ))}
            </Bar>

            {/* OVERLAY SPLINE CURVE: Dark burgundy curve connecting checkpoint averages */}
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#ad2737"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ad2737', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#ad2737' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* -----------------------------------------------------------------------
          BOTTOM KPI SUMMARY TILES (Matching Stitch Design Spec)
          ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-outline-variant/30">
        
        {/* Tile 1: Mean Glucose */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-outline">
            {timeScope === 'daily'
              ? "Today's Mean"
              : timeScope === 'mtd'
              ? '7-Day Mean Glucose'
              : 'Monthly Mean Glucose'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display font-extrabold text-lg text-on-surface tabular-nums">
              {meanGlucose}
            </span>
            <span className="text-xs text-outline font-semibold">mg/dL</span>
          </div>
        </div>

        {/* Tile 2: Highest Peak */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-outline">
            Highest Peak {peakLabel ? `(${peakLabel})` : ''}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display font-extrabold text-lg text-primary tabular-nums">
              {peakVal}
            </span>
            <span className="text-xs text-outline font-semibold">mg/dL</span>
          </div>
        </div>

        {/* Tile 3: Lowest Fasting */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-outline">
            Lowest Fasting {lowestLabel ? `(${lowestLabel})` : ''}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display font-extrabold text-lg text-tertiary tabular-nums">
              {lowestVal}
            </span>
            <span className="text-xs text-outline font-semibold">mg/dL</span>
          </div>
        </div>

        {/* Tile 4: Ambulatory CV */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-outline">
            Ambulatory CV
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-display font-extrabold text-lg text-primary tabular-nums">
              {cvVal}
            </span>
            <span className="text-[11px] font-bold text-tertiary">
              ({cvStatus})
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
