import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HelpCircle, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MetabolicStabilityCard = ({ score = 88, change = '+1.2', readingsCount = 0 }) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const hasData = isDemo || readingsCount > 0;

  const arcRef = useRef(null);
  const scoreRef = useRef(null);

  useEffect(() => {
    if (arcRef.current) {
      if (hasData) {
        gsap.fromTo(
          arcRef.current,
          { strokeDashoffset: 250, opacity: 0.2 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }
        );
      } else {
        arcRef.current.style.strokeDashoffset = '250';
      }
    }

    if (scoreRef.current) {
      if (hasData) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: score,
          duration: 1.0,
          ease: 'power2.out',
          onUpdate: () => {
            if (scoreRef.current) {
              scoreRef.current.innerText = Math.round(obj.val).toString();
            }
          }
        });
      } else {
        scoreRef.current.innerText = '—';
      }
    }
  }, [score, hasData]);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-space-lg border border-outline-variant/40 shadow-xs flex flex-col justify-between min-w-0 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-title-md text-title-md text-on-surface font-bold">
            Metabolic Stability
          </span>
          <HelpCircle className="w-4 h-4 text-outline" />
        </div>
        <button
          type="button"
          aria-label="More options"
          className="p-1 rounded-md hover:bg-surface-container-high text-outline transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Arch Graphic SVG */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg className="w-56 h-32" viewBox="0 0 200 115">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--surface-container-high, #FDE2E5)"
            strokeLinecap="round"
            strokeWidth="16"
          />
          {/* Active Rose Progress Arc */}
          <path
            ref={arcRef}
            d="M 20 100 A 80 80 0 0 1 168 56"
            fill="none"
            stroke="var(--primary, #AD2737)"
            strokeLinecap="round"
            strokeWidth="16"
            strokeDasharray="250"
            strokeDashoffset={hasData ? 0 : 250}
          />
          {/* Inner Subtle Track */}
          <path
            d="M 32 100 A 68 68 0 0 1 168 100"
            fill="none"
            stroke="var(--surface-container-low, #FFF0F1)"
            strokeDasharray="2,4"
            strokeWidth="4"
          />
        </svg>

        {/* Gauge Score Display */}
        <div className="absolute bottom-2 text-center flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span
              ref={scoreRef}
              className="font-display-lg text-display-lg font-bold text-on-surface leading-none tracking-tight tabular-nums"
            >
              {hasData ? score : '—'}
            </span>
            {hasData && (
              <span className="font-label-sm text-label-sm font-bold text-tertiary bg-tertiary-fixed/30 px-1.5 py-0.5 rounded-full tabular-nums">
                {change}
              </span>
            )}
          </div>
          <span className="font-label-sm text-label-sm font-medium text-outline mt-0.5">
            {hasData ? 'of 100 index points' : 'Pending checkpoints'}
          </span>
        </div>
      </div>

      {/* Stability Callout Box */}
      <div className="bg-surface-container-low rounded-lg p-space-sm text-center mb-space-sm">
        {hasData ? (
          <>
            <p className="font-label-lg text-label-lg font-semibold text-primary flex items-center justify-center gap-1">
              <span>Your glucose is stable! ✨</span>
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
              Glycemic variability CV is under 16% (CV 16.2%). You stayed within the 70–140 target corridor for 18 continuous hours.
            </p>
          </>
        ) : (
          <>
            <p className="font-label-lg text-label-lg font-semibold text-on-surface flex items-center justify-center gap-1">
              <span>Awaiting Daily Checkpoints</span>
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
              Log your fasting and post-meal readings to calculate your personalized metabolic stability index.
            </p>
          </>
        )}
      </div>

      {/* Action CTA Link */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center justify-center gap-1 font-label-md text-label-md font-bold text-primary hover:text-primary-container hover:underline transition-colors py-1"
      >
        <span>Improve Your Score</span>
        <ArrowRight className="w-4 h-4 text-primary" />
      </a>
    </div>
  );
};
