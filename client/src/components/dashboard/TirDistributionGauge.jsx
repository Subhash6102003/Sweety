import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, ChevronRight, PieChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TirDistributionGauge = ({ distribution }) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';

  const total = (distribution?.in_target_count || 0) + (distribution?.high_count || 0) + (distribution?.low_count || 0);
  const hasData = total > 0 || isDemo;

  const inRangePercent = total > 0
    ? Math.round((distribution.in_target_count / total) * 100)
    : (isDemo ? 88 : null);

  const inRangeCount = total > 0 ? distribution.in_target_count : (isDemo ? 84 : 0);
  const highCount = total > 0 ? distribution.high_count : (isDemo ? 12 : 0);
  const lowCount = total > 0 ? distribution.low_count : 0;

  const scoreRef = useRef(null);
  const targetCircleRef = useRef(null);

  useEffect(() => {
    if (scoreRef.current) {
      if (inRangePercent !== null) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: inRangePercent,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (scoreRef.current) {
              scoreRef.current.innerText = `${Math.round(obj.val)}%`;
            }
          }
        });
      } else {
        scoreRef.current.innerText = '—';
      }
    }

    if (targetCircleRef.current) {
      if (inRangePercent !== null) {
        const strokeOffset = 251.2 * (1 - inRangePercent / 100);
        gsap.fromTo(
          targetCircleRef.current,
          { strokeDashoffset: 251.2 },
          { strokeDashoffset: strokeOffset, duration: 1.4, ease: 'power2.out' }
        );
      } else {
        targetCircleRef.current.style.strokeDashoffset = '251.2';
      }
    }
  }, [inRangePercent]);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/40 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/30 mb-space-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-title-md text-title-md text-on-surface font-bold">
            Time in Range (TIR) Distribution
          </span>
          <PieChart className="w-4 h-4 text-outline" />
        </div>
        <span className="font-label-sm text-label-sm font-semibold text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
          {inRangePercent !== null ? (inRangePercent >= 70 ? 'Target Met (≥70%)' : 'Below Target') : 'No Data'}
        </span>
      </div>

      {/* Donut Chart Canvas matching Stitch */}
      <div className="flex items-center justify-center my-3 relative">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="var(--surface-container-high, #FDE2E5)"
              strokeWidth="12"
            />
            {/* Target Ring (Rose) */}
            <circle
              ref={targetCircleRef}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="var(--primary, #AD2737)"
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={inRangePercent !== null ? 251.2 * (1 - inRangePercent / 100) : 251.2}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              ref={scoreRef}
              className="font-display-md text-display-md font-bold text-on-surface leading-none tabular-nums"
            >
              {inRangePercent !== null ? `${inRangePercent}%` : '—'}
            </span>
            <span className="font-label-sm text-label-sm text-outline mt-1 font-semibold">
              {inRangePercent !== null ? 'Time In Range' : 'Awaiting logs'}
            </span>
            <span className="text-[10px] text-tertiary font-bold">70–140 mg/dL</span>
          </div>
        </div>
      </div>

      {/* Legend Breakdown matching Stitch */}
      <div className="space-y-1.5 pt-2 border-t border-outline-variant/20 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-on-surface font-medium">In Target Range (70–140)</span>
          </div>
          <span className="font-bold text-on-surface tabular-nums">
            {inRangePercent !== null ? `${inRangePercent}% (${inRangeCount})` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error" />
            <span className="text-on-surface font-medium">Elevated (&gt;140)</span>
          </div>
          <span className="font-bold text-on-surface tabular-nums">
            {total > 0 ? `${Math.round((highCount / total) * 100)}% (${highCount})` : isDemo ? '12%' : '0%'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
            <span className="text-on-surface font-medium">Hypoglycemia (&lt;70)</span>
          </div>
          <span className="font-bold text-on-surface tabular-nums">
            {total > 0 ? `${Math.round((lowCount / total) * 100)}% (${lowCount})` : '0%'}
          </span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-outline-variant/20">
        <span className="font-label-sm text-label-sm text-outline">Clinical Consensus</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-0.5 font-label-sm text-label-sm font-bold text-primary hover:underline"
        >
          <span>Consensus Target</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
