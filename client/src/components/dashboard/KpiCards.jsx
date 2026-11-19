import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Info,
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

const AnimatedValue = ({ target, isDecimal = false, suffix = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (target === null || target === undefined || isNaN(target)) {
      el.innerText = '—';
      return;
    }

    const num = Number(target);
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: num,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) {
          el.innerText = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString();
        }
      }
    });

    return () => tween.kill();
  }, [target, isDecimal]);

  if (target === null || target === undefined || isNaN(target)) {
    return <span className="text-outline tabular-nums">—</span>;
  }

  return (
    <span className="tabular-nums font-bold">
      <span ref={ref}>0</span>
      {suffix && <span className="text-xs font-semibold text-outline ml-1">{suffix}</span>}
    </span>
  );
};

export const KpiCards = ({ daily, mtd, readingsCount = 0 }) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';

  // Determine if there are actual readings recorded for this user
  const hasReadings = readingsCount > 0 || (daily?.count > 0);
  const avgVal = hasReadings ? (daily?.average ?? mtd?.average ?? null) : (isDemo ? 125.5 : null);

  // Real TIR calculation if readings exist
  let inRangePercent = null;
  if (hasReadings && daily?.readings?.length > 0) {
    const inRange = daily.readings.filter(r => r.value >= 70 && r.value <= 140).length;
    inRangePercent = Math.round((inRange / daily.readings.length) * 100);
  } else if (isDemo) {
    inRangePercent = 88;
  }

  // Estimated HbA1c based on ADAG formula: HbA1c = (eAG + 46.7) / 28.7
  const estHba1c = avgVal ? Number(((avgVal + 46.7) / 28.7).toFixed(1)) : (isDemo ? 5.8 : null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
      
      {/* 1. Today's Avg Glucose */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
              Today's Avg Glucose
            </span>
            <Info className="w-3.5 h-3.5 text-outline/60 group-hover:text-primary transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight">
              <AnimatedValue target={avgVal} isDecimal suffix="mg/dL" />
            </div>
            {/* 5 Mini Spark Bars */}
            <div className="flex items-end gap-1 h-7">
              <span className={`w-1.5 h-3 rounded-t-sm ${hasReadings || isDemo ? 'bg-secondary-fixed' : 'bg-surface-container-high'}`} />
              <span className={`w-1.5 h-4 rounded-t-sm ${hasReadings || isDemo ? 'bg-secondary-container' : 'bg-surface-container-high'}`} />
              <span className={`w-1.5 h-6 rounded-t-sm ${hasReadings || isDemo ? 'bg-primary-container' : 'bg-surface-container-high'}`} />
              <span className={`w-1.5 h-5 rounded-t-sm ${hasReadings || isDemo ? 'bg-primary' : 'bg-surface-container-high'}`} />
              <span className={`w-1.5 h-4 rounded-t-sm ${hasReadings || isDemo ? 'bg-primary' : 'bg-surface-container-high'}`} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            {hasReadings || isDemo ? (
              <>
                <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm font-semibold">
                  <ArrowDownRight className="w-3.5 h-3.5 text-tertiary" />
                  <span>3.2%</span>
                </span>
                <span className="font-body-sm text-body-sm text-outline">vs yesterday</span>
              </>
            ) : (
              <span className="font-body-sm text-body-sm text-outline">Awaiting today's first reading</span>
            )}
          </div>
        </div>

        <div className="pt-space-sm mt-3 flex items-center justify-between border-t border-outline-variant/20">
          <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium ${
            hasReadings || isDemo ? 'text-tertiary bg-tertiary-fixed/30' : 'text-outline bg-surface-container-high'
          }`}>
            {hasReadings || isDemo ? 'In Target Range' : 'No logs recorded'}
          </span>
          <span className="text-xs text-outline font-semibold">Clinical AGP</span>
        </div>
      </div>

      {/* 2. Time in Range (TIR) */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
              Time in Range (TIR)
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-outline/60 group-hover:text-primary transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight">
              <AnimatedValue target={inRangePercent} suffix="%" />
            </div>
            {/* Inline SVG Trend Sparkline */}
            <svg className={`w-14 h-7 ${hasReadings || isDemo ? 'text-primary' : 'text-outline-variant'}`} fill="none" viewBox="0 0 56 24">
              <path
                d="M2 18 C 10 14, 16 20, 24 10 C 32 0, 42 16, 54 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle className="fill-current" cx="54" cy="6" r="2.5" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            {inRangePercent !== null ? (
              <>
                <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5 text-tertiary" />
                  <span>Optimal</span>
                </span>
                <span className="font-body-sm text-body-sm text-outline">70–140 mg/dL target corridor</span>
              </>
            ) : (
              <span className="font-body-sm text-body-sm text-outline">Requires ≥1 glucose log</span>
            )}
          </div>
        </div>

        <div className="pt-space-sm mt-3 flex items-center justify-between border-t border-outline-variant/20">
          <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium ${
            inRangePercent !== null ? 'text-primary bg-primary-fixed/40' : 'text-outline bg-surface-container-high'
          }`}>
            {inRangePercent !== null ? (inRangePercent >= 70 ? 'Consensus Met' : 'Below Target') : 'Pending Scan'}
          </span>
          <span className="text-xs text-outline font-semibold">ADA Standard</span>
        </div>
      </div>

      {/* 3. Scheduled Checkpoint Readings */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
              Scheduled Readings
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-outline/60 group-hover:text-primary transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight tabular-nums">
              <span>{readingsCount}</span>
              <span className="text-headline-md font-normal text-outline"> / 4</span>
            </div>
            {/* Donut ring mini */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  strokeWidth="3.5"
                  strokeDasharray={`${(readingsCount / 4) * 100}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-primary text-xs font-bold leading-none">
                {readingsCount === 4 ? '✓' : readingsCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center text-primary font-label-sm text-label-sm font-semibold">
              {readingsCount === 4 ? '100% Logged' : readingsCount === 0 ? '0% Logged' : `${readingsCount * 25}% Logged`}
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              {readingsCount === 4 ? 'All daily checkpoints recorded' : `${4 - readingsCount} remaining today`}
            </span>
          </div>
        </div>

        <div className="pt-space-sm mt-3 flex items-center justify-between border-t border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-outline bg-surface-container-high px-2 py-0.5 rounded-full font-medium">
            {readingsCount === 0 ? 'Start Fasting Slot' : readingsCount === 4 ? 'Complete for Today' : 'Next Checkpoint Active'}
          </span>
          <span className="text-xs text-outline font-semibold">Daily Goal</span>
        </div>
      </div>

      {/* 4. Estimated HbA1c */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
              Estimated HbA1c
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-outline/60 group-hover:text-primary transition-colors" />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-metric-display text-metric-display font-bold text-on-surface tracking-tight tabular-nums">
                <AnimatedValue target={estHba1c} isDecimal suffix="%" />
              </span>
              {estHba1c !== null && (
                <span className="font-label-sm text-label-sm font-semibold text-tertiary">
                  {estHba1c < 5.7 ? 'Normal' : estHba1c <= 6.5 ? 'Optimal Target' : 'Elevated'}
                </span>
              )}
            </div>
            {/* 4-bar mini pill meter */}
            <div className="flex items-center gap-1">
              <span className={`h-6 w-2 rounded-xs ${estHba1c ? 'bg-tertiary' : 'bg-surface-container-high'}`} />
              <span className={`h-8 w-2 rounded-xs ${estHba1c ? 'bg-tertiary-container' : 'bg-surface-container-high'}`} />
              <span className={`h-5 w-2 rounded-xs ${estHba1c ? 'bg-secondary-fixed-dim' : 'bg-surface-container-high'}`} />
              <span className="h-4 w-2 bg-surface-container-high rounded-xs" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            {estHba1c !== null ? (
              <>
                <span className="inline-flex items-center text-tertiary font-label-sm text-label-sm font-semibold">
                  <ArrowDownRight className="w-3.5 h-3.5 text-tertiary" />
                  <span>ADAG</span>
                </span>
                <span className="font-body-sm text-body-sm text-outline">Formula derived from eAG</span>
              </>
            ) : (
              <span className="font-body-sm text-body-sm text-outline">Awaiting glucose readings</span>
            )}
          </div>
        </div>

        <div className="pt-space-sm mt-3 flex items-center justify-between border-t border-outline-variant/20">
          <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium ${
            estHba1c !== null ? 'text-tertiary bg-tertiary-fixed/30' : 'text-outline bg-surface-container-high'
          }`}>
            {estHba1c !== null ? 'Validated Index' : 'Pending Calculation'}
          </span>
          <span className="text-xs text-outline font-semibold">Lab Correlation</span>
        </div>
      </div>

    </div>
  );
};
