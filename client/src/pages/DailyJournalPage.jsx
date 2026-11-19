import React, { useState } from 'react';
import { Calendar, Plus, Clock, Droplet, Utensils, Zap, FileText } from 'lucide-react';

export const DailyJournalPage = ({ onOpenLogModal }) => {
  const [selectedDay, setSelectedDay] = useState('Today, Nov 19, 2026');

  const journalEntries = [
    {
      slot: 'Morning (fasting)',
      time: '07:15 AM',
      glucose: '98 mg/dL',
      inTarget: true,
      status: 'Optimal In-Range',
      carbs: '0g',
      insulin: 'Tresiba 18u (Basal)',
      notes: 'Woke up feeling rested. Zero dawn phenomenon drift overnight.'
    },
    {
      slot: 'After breakfast',
      time: '09:30 AM',
      glucose: '128 mg/dL',
      inTarget: true,
      status: 'In-Target Postprandial',
      carbs: '34g',
      insulin: 'Novolog 3.5u (Bolus)',
      notes: 'Steel-cut oats with chia seeds & almond butter. Pre-bolused 15 min prior.'
    },
    {
      slot: 'After lunch',
      time: '01:30 PM',
      glucose: '158 mg/dL',
      inTarget: false,
      isSpike: true,
      status: 'Post-Lunch Spike Excursion',
      carbs: '58g',
      insulin: 'Novolog 5.0u + 0.8u correction',
      notes: 'Brown rice bowl with grilled chicken & teriyaki sauce. Sugar spike handled via correction.'
    },
    {
      slot: 'After dinner',
      time: '07:45 PM',
      glucose: '118 mg/dL',
      inTarget: true,
      status: 'Optimal In-Range',
      carbs: '22g',
      insulin: 'Novolog 2.0u',
      notes: 'Grilled salmon, roasted asparagus, and olive oil salad. Steady flat curve.'
    }
  ];

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Daily Glycemic Journal
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Holistic chronological timeline correlating glucose readings, meal carbohydrates, insulin boluses, and qualitative notes.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogModal}
          className="self-start sm:self-auto px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-sm hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Journal Entry</span>
        </button>
      </div>

      {/* Daily Milestones Timeline */}
      <div className="space-y-4">
        {journalEntries.map((entry, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
          >
            {/* Slot & Time */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xs shrink-0 ${
                entry.isSpike
                  ? 'bg-error-container text-on-error-container border border-error/30'
                  : 'bg-primary text-on-primary'
              }`}>
                {entry.glucose.split(' ')[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-on-surface">{entry.slot}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    entry.isSpike
                      ? 'bg-error/10 text-error'
                      : 'bg-tertiary/10 text-tertiary'
                  }`}>
                    {entry.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-outline font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {entry.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-secondary" /> {entry.carbs} Carbs
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-primary" /> {entry.insulin}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2 max-w-xl italic">
                  "{entry.notes}"
                </p>
              </div>
            </div>

            {/* In-Range Pill */}
            <div className="self-end md:self-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                entry.isSpike
                  ? 'bg-error-container text-error'
                  : 'bg-surface-container-low text-primary'
              }`}>
                {entry.isSpike ? 'Spike Alert (+38 mg/dL)' : 'Target Matched'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
