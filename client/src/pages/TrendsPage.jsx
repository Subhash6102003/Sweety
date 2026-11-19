import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { TrendingUp, TrendingDown, Clock, Calendar, BarChart2, Zap, AlertCircle, CheckCircle, ArrowRight, Inbox } from 'lucide-react';

export const TrendsPage = () => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const [selectedEpoch, setSelectedEpoch] = useState('30 Days');
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/api/readings')
      .then(res => setReadings(res.readings || []))
      .catch(() => setReadings([]))
      .finally(() => setLoading(false));
  }, []);

  const hasData = readings.length > 0;

  // Real calculations
  let fastingAvg = '—';
  let postMealAvg = '—';
  let totalAvg = '—';
  let inRangePct = '—';

  if (hasData) {
    const fasting = readings.filter(r => r.slot === 'Morning (fasting)');
    if (fasting.length > 0) {
      fastingAvg = (fasting.reduce((a, b) => a + b.value, 0) / fasting.length).toFixed(1);
    }

    const postMeal = readings.filter(r => r.slot === 'After breakfast' || r.slot === 'After lunch' || r.slot === 'After dinner');
    if (postMeal.length > 0) {
      postMealAvg = (postMeal.reduce((a, b) => a + b.value, 0) / postMeal.length).toFixed(1);
    }

    const sum = readings.reduce((a, b) => a + b.value, 0);
    totalAvg = (sum / readings.length).toFixed(1);

    const inRange = readings.filter(r => r.value >= 70 && r.value <= 140).length;
    inRangePct = `${Math.round((inRange / readings.length) * 100)}%`;
  } else if (isDemo) {
    fastingAvg = '98.2';
    postMealAvg = '132.0';
    totalAvg = '125.5';
    inRangePct = '88.0%';
  }

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 font-sans text-on-surface">
      
      {/* Top Command & Scope Header */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-bold tracking-wide uppercase">
              Metabolic Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="text-xs text-outline font-semibold">
              {hasData ? `${readings.length} Validated Logged Records` : isDemo ? 'Demo Dataset' : 'Awaiting Checkpoints'}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Trends &amp; Glycemic Insights
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Metabolic pattern recognition and circadian variability analysis calculated from your recorded Supabase glucose readings.
          </p>
        </div>

        {/* Scope selector */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-xl shadow-xs self-start xl:self-end">
          {['7 Days', '14 Days', '30 Days', 'All Time'].map((epoch) => (
            <button
              key={epoch}
              type="button"
              onClick={() => setSelectedEpoch(epoch)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedEpoch === epoch
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {epoch}
            </button>
          ))}
        </div>
      </section>

      {/* 4 Key Trend Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1: Dawn / Fasting */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Fasting Telemetry</span>
              <span className="text-sm font-bold text-on-surface">Morning Waking Level</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              fastingAvg !== '—' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-outline'
            }`}>
              {fastingAvg !== '—' ? 'Tracked' : 'No Data'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">{fastingAvg}</span>
            {fastingAvg !== '—' && <span className="text-xs text-outline font-semibold">mg/dL</span>}
          </div>
          <div className="mt-2 text-xs text-outline font-medium flex items-center gap-1">
            {fastingAvg !== '—' ? 'Morning baseline target 70–110 mg/dL' : 'Log morning fasting reading to track'}
          </div>
        </div>

        {/* Card 2: Postprandial */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Postprandial Response</span>
              <span className="text-sm font-bold text-on-surface">Mean Post-Meal Reading</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              postMealAvg !== '—' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-outline'
            }`}>
              {postMealAvg !== '—' ? 'Calculated' : 'No Data'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">{postMealAvg}</span>
            {postMealAvg !== '—' && <span className="text-xs text-outline font-semibold">mg/dL</span>}
          </div>
          <div className="mt-2 text-xs text-outline font-medium flex items-center gap-1">
            {postMealAvg !== '—' ? 'Target ceiling < 140 mg/dL' : 'Log post-meal readings to evaluate'}
          </div>
        </div>

        {/* Card 3: Overall Mean */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Mean Glycemia</span>
              <span className="text-sm font-bold text-on-surface">Overall Mean Glucose</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              totalAvg !== '—' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-outline'
            }`}>
              {totalAvg !== '—' ? 'Average' : 'Pending'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">{totalAvg}</span>
            {totalAvg !== '—' && <span className="text-xs text-outline font-semibold">mg/dL</span>}
          </div>
          <div className="mt-2 text-xs text-outline font-medium flex items-center gap-1">
            {totalAvg !== '—' ? `Derived from ${readings.length} total readings` : 'Awaiting checkpoint logs'}
          </div>
        </div>

        {/* Card 4: TIR */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Consensus Metric</span>
              <span className="text-sm font-bold text-on-surface">Time in Target Range</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              inRangePct !== '—' ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-outline'
            }`}>
              {inRangePct !== '—' ? 'Goal > 70%' : 'No Data'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">{inRangePct}</span>
          </div>
          <div className="mt-2 text-xs text-outline font-medium flex items-center gap-1">
            {inRangePct !== '—' ? '70–140 mg/dL clinical window' : 'Requires ≥1 recorded reading'}
          </div>
        </div>

      </section>

      {/* Main Trends Display */}
      {hasData || isDemo ? (
        <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div>
              <h2 className="font-display text-base font-bold text-on-surface">
                Circadian Checkpoint Distribution
              </h2>
              <p className="text-xs text-outline">
                Average blood glucose reading grouped by clinical milestone slot.
              </p>
            </div>
            <span className="text-xs font-bold text-primary">Live Database Sync</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { slot: 'Morning (fasting)', time: '07:00 AM', target: '70–110 mg/dL' },
              { slot: 'After breakfast', time: '09:30 AM', target: '< 140 mg/dL' },
              { slot: 'After lunch', time: '01:30 PM', target: '< 140 mg/dL' },
              { slot: 'After dinner', time: '08:30 PM', target: '< 140 mg/dL' }
            ].map((slotCfg) => {
              const slotReadings = readings.filter(r => r.slot === slotCfg.slot);
              const count = slotReadings.length;
              let avg = '—';
              if (count > 0) {
                avg = (slotReadings.reduce((a, b) => a + b.value, 0) / count).toFixed(1);
              } else if (isDemo) {
                avg = '118.0';
              }

              return (
                <div key={slotCfg.slot} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-on-surface">{slotCfg.slot}</strong>
                    <span className="text-[10px] text-outline font-semibold">{count} logged</span>
                  </div>
                  <div className="text-2xl font-black text-on-surface tabular-nums">
                    {avg} {avg !== '—' && <span className="text-xs font-normal text-outline">mg/dL</span>}
                  </div>
                  <div className="text-[11px] text-outline flex items-center justify-between pt-1 border-t border-outline-variant/20">
                    <span>Target: {slotCfg.target}</span>
                    <span className="font-bold text-tertiary">{count > 0 ? 'Active' : 'Unlogged'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="p-12 rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/60 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-on-surface">No Glucose Readings Recorded Yet</h3>
            <p className="text-xs text-outline max-w-md mx-auto mt-1">
              Trends, circadian variance, and dawn phenomenon analytics are calculated strictly from your personal logged checkpoints. Record readings on the Dashboard to reveal your data.
            </p>
          </div>
        </section>
      )}

    </div>
  );
};
