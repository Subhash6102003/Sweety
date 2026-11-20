import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, ArrowDownRight, ArrowUpRight, BarChart3, Inbox } from 'lucide-react';

const AnimatedNumber = ({ value, isDecimal = false }) => {
  const spanRef = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined) return;

    const el = spanRef.current;
    if (!el) return;

    const targetVal = Number(value);
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: targetVal,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) {
          el.innerText = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString();
        }
      }
    });

    return () => {
      tween.kill();
    };
  }, [value, isDecimal]);

  if (value === null || value === undefined) {
    return <span className="text-outline font-normal">—</span>;
  }

  return (
    <span className="tabular-nums font-extrabold text-on-surface" ref={spanRef}>
      0
    </span>
  );
};

export const ReportCard = ({ title, subtitle, data, highlight = false }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [data]);

  const isEmpty = !data || data.count === 0;

  return (
    <div
      ref={cardRef}
      className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
        highlight
          ? 'bg-gradient-to-br from-white to-theme-primary-light/40 border-2 border-theme-primary/30 shadow-md'
          : 'bg-white border border-theme-border shadow-xs hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-sm text-gray-900 tracking-tight">
            {title}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {data?.count || 0} readings
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
      </div>

      {/* Body: Empty State or Metrics */}
      {isEmpty ? (
        <div className="my-6 py-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
            <Inbox className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-gray-400">No readings recorded</span>
          <span className="text-[10px] text-gray-400 mt-0.5">Logs for this period will appear here</span>
        </div>
      ) : (
        <>
          <div className="my-4 grid grid-cols-3 gap-2 sm:gap-2.5">
            {/* Average */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col items-center justify-between text-center min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-primary shrink-0" />
                <span>Avg</span>
              </span>
              <div className="font-display font-extrabold text-base sm:text-lg text-on-surface leading-tight tabular-nums truncate w-full">
                <AnimatedNumber value={data.average} isDecimal />
              </div>
              <span className="text-[10px] font-semibold text-outline mt-0.5">mg/dL</span>
            </div>

            {/* Highest */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col items-center justify-between text-center min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline flex items-center justify-center gap-1 mb-1">
                <ArrowUpRight className="w-3 h-3 text-primary shrink-0" />
                <span>High</span>
              </span>
              <div className="font-display font-extrabold text-base sm:text-lg text-on-surface leading-tight tabular-nums truncate w-full">
                <AnimatedNumber value={data.highest} />
              </div>
              <span className="text-[10px] font-semibold text-outline mt-0.5">mg/dL</span>
            </div>

            {/* Lowest */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col items-center justify-between text-center min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-outline flex items-center justify-center gap-1 mb-1">
                <ArrowDownRight className="w-3 h-3 text-tertiary shrink-0" />
                <span>Low</span>
              </span>
              <div className="font-display font-extrabold text-base sm:text-lg text-on-surface leading-tight tabular-nums truncate w-full">
                <AnimatedNumber value={data.lowest} />
              </div>
              <span className="text-[10px] font-semibold text-outline mt-0.5">mg/dL</span>
            </div>
          </div>

          {/* Daily Report Slot Readings List */}
          {title === 'Daily Report' && data?.readings && data.readings.length > 0 && (
            <div className="mb-4 pt-3 border-t border-gray-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Daily Checkpoints by Slot:
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {data.readings.map((r) => (
                  <div key={r.id || r.slot} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 text-xs">
                    <span className="font-semibold text-gray-700">{r.slot}</span>
                    <span className="font-bold text-gray-900 tabular-nums">{r.value} mg/dL</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer Range */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Range:</span>
        <span className="font-medium text-gray-600">{data?.range || '—'}</span>
      </div>
    </div>
  );
};

export const ReportCards = ({ reports }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <ReportCard
        title="Daily Report"
        subtitle="Selected Day Summary"
        data={reports?.daily}
        highlight
      />
      <ReportCard
        title="Month-to-Date"
        subtitle="1st of Month to Selected Date"
        data={reports?.mtd}
      />
      <ReportCard
        title="Previous Month"
        subtitle="Whole Preceding Calendar Month"
        data={reports?.previousMonth}
      />
    </div>
  );
};
