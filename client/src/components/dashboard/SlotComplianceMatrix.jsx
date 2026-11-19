import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const SlotComplianceMatrix = ({ dailyReadings = [] }) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';

  const DEMO_MATRIX_DATA = [
    {
      slot: 'Fasting',
      legacyAlias: 'Fasting',
      timeSlot: 'Morning 6–8 AM',
      readings: [
        { day: 'Mon', value: '98', time: '07:15 AM', status: 'Optimal In-Range', inTarget: true },
        { day: 'Tue', value: '104', time: '07:10 AM', status: 'In-Target', inTarget: true },
        { day: 'Wed', value: '94', time: '07:20 AM', status: 'Lowest Fasting (Optimal)', inTarget: true },
        { day: 'Thu', value: '112', time: '07:05 AM', status: 'In-Target', inTarget: true },
        { day: 'Fri', value: '99', time: '07:15 AM', status: 'In-Target', inTarget: true },
        { day: 'Sat', value: '102', time: '08:30 AM', status: 'In-Target', inTarget: true },
        { day: 'Sun', value: '97', time: '08:15 AM', status: 'In-Target', inTarget: true }
      ]
    },
    {
      slot: 'Breakfast',
      legacyAlias: 'Breakfast',
      timeSlot: 'Post-Breakfast 9–11 AM',
      readings: [
        { day: 'Mon', value: '128', time: '09:30 AM', status: 'In-Target', inTarget: true },
        { day: 'Tue', value: '119', time: '09:15 AM', status: 'In-Target', inTarget: true },
        { day: 'Wed', value: '122', time: '09:45 AM', status: 'In-Target', inTarget: true },
        { day: 'Thu', value: '134', time: '09:20 AM', status: 'In-Target', inTarget: true },
        { day: 'Fri', value: '118', time: '09:10 AM', status: 'In-Target', inTarget: true },
        { day: 'Sat', value: '139', time: '10:00 AM', status: 'Near Threshold (139 mg/dL)', inTarget: true },
        { day: 'Sun', value: '121', time: '09:30 AM', status: 'In-Target', inTarget: true }
      ]
    },
    {
      slot: 'Lunch',
      legacyAlias: 'Lunch',
      timeSlot: 'Post-Lunch 1–3 PM',
      readings: [
        { day: 'Mon', value: '131', time: '01:15 PM', status: 'In-Target', inTarget: true },
        { day: 'Tue', value: '124', time: '01:30 PM', status: 'In-Target', inTarget: true },
        { day: 'Wed', value: '129', time: '01:20 PM', status: 'In-Target', inTarget: true },
        { day: 'Thu', value: '158', time: '01:30 PM', status: 'Post-Lunch Spike (+38 mg/dL)', isSpike: true, inTarget: false },
        { day: 'Fri', value: '127', time: '01:10 PM', status: 'In-Target', inTarget: true },
        { day: 'Sat', value: '135', time: '01:45 PM', status: 'In-Target', inTarget: true },
        { day: 'Sun', value: '122', time: '01:30 PM', status: 'In-Target', inTarget: true }
      ]
    },
    {
      slot: 'Bedtime',
      legacyAlias: 'Dinner',
      timeSlot: 'Bedtime 9–11 PM',
      readings: [
        { day: 'Mon', value: '110', time: '10:15 PM', status: 'In-Target', inTarget: true },
        { day: 'Tue', value: '114', time: '10:30 PM', status: 'In-Target', inTarget: true },
        { day: 'Wed', value: '108', time: '10:00 PM', status: 'In-Target', inTarget: true },
        { day: 'Thu', value: '126', time: '10:20 PM', status: 'In-Target', inTarget: true },
        { day: 'Fri', value: '112', time: '10:15 PM', status: 'In-Target', inTarget: true },
        { day: 'Sat', value: '116', time: '10:45 PM', status: 'In-Target', inTarget: true },
        { day: 'Sun', value: 'Pending', time: 'Pending scan', status: 'Pending Bedtime Scan', isPending: true }
      ]
    }
  ];

  // Helper to build real matrix
  const buildRealMatrix = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const currentDayName = days[currentDayIdx];

    const slotConfigs = [
      { slot: 'Fasting', match: 'Morning (fasting)', timeSlot: 'Morning 6–8 AM' },
      { slot: 'Breakfast', match: 'After breakfast', timeSlot: 'Post-Breakfast 9–11 AM' },
      { slot: 'Lunch', match: 'After lunch', timeSlot: 'Post-Lunch 1–3 PM' },
      { slot: 'Bedtime', match: 'After dinner', timeSlot: 'Bedtime 9–11 PM' }
    ];

    return slotConfigs.map(cfg => {
      const readingForSlot = dailyReadings.find(r => r.slot === cfg.match);
      return {
        slot: cfg.slot,
        timeSlot: cfg.timeSlot,
        readings: days.map(d => {
          if (d === currentDayName && readingForSlot) {
            const val = readingForSlot.value;
            const inTarget = val >= 70 && val <= 140;
            const isSpike = val > 140;
            return {
              day: d,
              value: val.toString(),
              time: 'Today',
              status: inTarget ? 'In-Target' : isSpike ? 'Elevated' : 'Hypoglycemia',
              inTarget,
              isSpike
            };
          }
          return {
            day: d,
            value: '--',
            time: 'Unrecorded',
            status: 'No check recorded',
            isPending: true
          };
        })
      };
    });
  };

  const matrixData = isDemo ? DEMO_MATRIX_DATA : buildRealMatrix();
  const [hoveredReading, setHoveredReading] = useState(null);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-space-lg border border-outline-variant/40 shadow-xs flex flex-col justify-between min-w-0 w-full">
      
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-sm pb-space-sm border-b border-outline-variant/30">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Slot Compliance Matrix
              </span>
              <span className="text-outline text-xs">⊞</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Weekly verification by clinical meal & fasting checkpoints
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-outline">In-Range:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-2.5 rounded-full bg-surface-container-high" title="Missed / Pending" />
              <span className="w-3.5 h-2.5 rounded-full bg-secondary-fixed" title="Acceptable" />
              <span className="w-3.5 h-2.5 rounded-full bg-primary-container" title="Target Matched" />
              <span className="w-3.5 h-2.5 rounded-full bg-primary" title="Optimal Exact" />
            </div>
          </div>
        </div>

        {/* Hover inspection toast */}
        <div className="h-6 flex items-center">
          {hoveredReading ? (
            <span className="font-label-sm text-label-sm text-on-surface bg-surface-container-low px-2 py-0.5 rounded-full border border-outline-variant/40 animate-fadeIn">
              <strong>{hoveredReading.slot} ({hoveredReading.day})</strong>: {hoveredReading.value} {hoveredReading.value !== '--' && hoveredReading.value !== 'Pending' && 'mg/dL'} • {hoveredReading.time} • <span className={hoveredReading.isSpike ? 'text-error font-bold' : hoveredReading.isPending ? 'text-outline font-medium' : 'text-tertiary font-semibold'}>{hoveredReading.status}</span>
            </span>
          ) : (
            <span className="font-label-sm text-label-sm text-outline">
              Hover over any cell to view timestamp and excursion telemetry.
            </span>
          )}
        </div>
      </div>

      {/* Grid Canvas Table with rounded pill badges */}
      <div className="overflow-x-auto my-space-xs">
        <div className="min-w-[480px]">
          {/* Day Columns Header */}
          <div className="grid grid-cols-8 gap-2 mb-2 text-center">
            <div className="font-label-sm text-label-sm text-outline font-semibold text-left pl-2">
              Slot
            </div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className="font-label-sm text-label-sm text-on-surface-variant font-bold"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Matrix Rows (4 standard clinical time slots) */}
          <div className="space-y-2">
            {matrixData.map((row) => (
              <div
                key={row.slot}
                className="grid grid-cols-8 gap-2 items-center text-center"
              >
                {/* Slot Name */}
                <div className="text-left pl-2">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface block leading-tight">
                    {row.slot}
                  </span>
                  <span className="font-body-xs text-[10px] text-outline block leading-none">
                    {row.timeSlot.split(' ')[0]}
                  </span>
                </div>

                {/* 7 Day Cells */}
                {row.readings.map((reading) => {
                  let cellBg = 'bg-surface-container-high text-outline';
                  let ringStyle = '';

                  if (reading.isPending) {
                    cellBg = 'bg-surface-container-high/60 text-outline border border-dashed border-outline-variant/60';
                  } else if (reading.isSpike) {
                    cellBg = 'bg-primary text-on-primary font-bold shadow-xs';
                    ringStyle = 'ring-2 ring-primary ring-offset-1 ring-offset-surface-container-lowest';
                  } else if (reading.inTarget) {
                    const num = parseInt(reading.value, 10);
                    if (num >= 90 && num <= 110) {
                      cellBg = 'bg-primary/90 text-on-primary font-bold';
                    } else if (num > 130) {
                      cellBg = 'bg-secondary-container text-on-secondary-container font-semibold';
                    } else {
                      cellBg = 'bg-primary-container text-on-primary-container font-semibold';
                    }
                  }

                  return (
                    <div
                      key={reading.day}
                      onMouseEnter={() =>
                        setHoveredReading({
                          ...reading,
                          slot: row.slot
                        })
                      }
                      onMouseLeave={() => setHoveredReading(null)}
                      className={`h-8 rounded-full flex items-center justify-center font-label-sm text-label-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 ${cellBg} ${ringStyle}`}
                      title={`${row.slot} on ${reading.day}: ${reading.value} mg/dL`}
                    >
                      <span className="tabular-nums">
                        {reading.value === 'Pending' ? '...' : reading.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-space-sm pt-space-xs flex flex-wrap items-center justify-between border-t border-outline-variant/20 gap-2">
        <span className="font-label-sm text-label-sm text-outline">
          {isDemo ? '27 of 28 standard milestone checkpoints confirmed' : `${dailyReadings.length} of 4 checkpoints recorded today`}
        </span>
        <span className="font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
          Standard AGP Protocol
        </span>
      </div>

    </div>
  );
};
