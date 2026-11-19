import React, { useState } from 'react';
import { Minus, Plus, Bookmark, Check, Utensils, Pill, Droplet } from 'lucide-react';

/**
 * 4 Clinical Timing Slots matching Stitch specifications and domain requirements:
 * Fasting, Pre-Meal (Breakfast), Post-Meal (Lunch), Bedtime (Dinner).
 */
const SLOTS = [
  { id: 'Morning (fasting)', label: 'Fasting', legacySlot: 'Fasting' },
  { id: 'After breakfast', label: 'Pre-Meal', legacySlot: 'Breakfast' },
  { id: 'After lunch', label: 'Post-Meal', legacySlot: 'Lunch' },
  { id: 'After dinner', label: 'Bedtime', legacySlot: 'Dinner' }
];

export const QuickGlucoseLogCard = ({ onSaveReading, existingSlots = [] }) => {
  // Automatically defaults to first unlogged slot using existingSlots prop
  const [selectedSlotId, setSelectedSlotId] = useState(() => {
    const unlogged = SLOTS.find(s => !existingSlots.includes(s.id));
    return unlogged ? unlogged.id : SLOTS[0].id;
  });

  const [value, setValue] = useState(122);
  const [insulin, setInsulin] = useState('3.5');
  const [carbs, setCarbs] = useState('45');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Two-way +/- tactile stepper constrains values within clinical 40–600 limits
  const handleDecrement = () => {
    if (value > 40) setValue(v => Math.max(40, v - 1));
  };

  const handleIncrement = () => {
    if (value < 600) setValue(v => Math.min(600, v + 1));
  };

  const handleSliderChange = (e) => {
    const newVal = Number(e.target.value);
    if (!isNaN(newVal) && newVal >= 40 && newVal <= 600) {
      setValue(newVal);
    }
  };

  const handleRecord = async () => {
    setLoading(true);
    setMessage('');
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const selectedSlot = SLOTS.find(s => s.id === selectedSlotId) || SLOTS[0];
      
      // Passes value, slot, insulin, carbs into onSaveReading handler
      await onSaveReading({
        date: todayStr,
        slot: selectedSlot.id,
        value: Number(value),
        insulin: insulin ? Number(insulin) || insulin : undefined,
        carbs: carbs ? Number(carbs) || carbs : undefined
      });
      setMessage('Recorded!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to record reading');
    } finally {
      setLoading(false);
    }
  };

  const currentSlot = SLOTS.find(s => s.id === selectedSlotId) || SLOTS[0];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md border border-outline-variant/40 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-1.5">
          <Droplet className="w-4 h-4 text-primary fill-primary/20" />
          <h3 className="font-title-md text-title-md text-on-surface font-bold">
            Quick Glucose Log
          </h3>
        </div>
        <span className="font-label-sm text-label-sm text-outline">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* 4 Slot Pills: Fasting, Pre-Meal, Post-Meal, Bedtime */}
      <div className="grid grid-cols-4 gap-1.5 mb-space-sm">
        {SLOTS.map((s) => {
          const isSelected = selectedSlotId === s.id;
          const isAlreadyLogged = existingSlots.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSlotId(s.id)}
              className={`py-1.5 px-1 rounded-lg font-label-sm text-label-sm font-semibold transition-all text-center ${
                isSelected
                  ? 'bg-primary text-on-primary shadow-xs'
                  : isAlreadyLogged
                  ? 'bg-surface-container-low text-outline/60 hover:bg-secondary-fixed'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-fixed'
              }`}
            >
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tactile Counter Stepper with Synchronized Range Slider */}
      <div className="bg-surface-container-low rounded-lg p-3 mb-space-sm">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={handleDecrement}
            id="decrement-btn"
            aria-label="Decrease glucose"
            className="w-9 h-9 rounded-md bg-surface-container-lowest text-on-surface font-bold text-lg flex items-center justify-center shadow-xs hover:bg-surface-container-high active:scale-95 transition-all"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span
                id="glucose-value-display"
                className="font-metric-display text-metric-display font-bold text-on-surface tabular-nums"
              >
                {value}
              </span>
              <span className="font-label-sm text-label-sm text-outline font-semibold">
                mg/dL
              </span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-medium">
              {currentSlot.label} Target ≤140
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            id="increment-btn"
            aria-label="Increase glucose"
            className="w-9 h-9 rounded-md bg-surface-container-lowest text-on-surface font-bold text-lg flex items-center justify-center shadow-xs hover:bg-surface-container-high active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Live Synchronized Range Slider */}
        <div className="px-1">
          <input
            type="range"
            min="40"
            max="600"
            value={value}
            onChange={handleSliderChange}
            aria-label="Glucose value slider"
            className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-outline font-semibold mt-1">
            <span>40</span>
            <span className="text-tertiary">100 (Optimal)</span>
            <span>600</span>
          </div>
        </div>
      </div>

      {/* Fully Controlled Fast Insulin & Carbs Inputs */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-low rounded-md border border-outline-variant/30">
          <Pill className="w-4 h-4 text-outline shrink-0" />
          <input
            type="text"
            value={insulin}
            onChange={(e) => setInsulin(e.target.value)}
            placeholder="Units (e.g. 3.5 u)"
            aria-label="Insulin bolus units"
            className="w-full bg-transparent text-on-surface font-body-sm text-body-sm outline-none placeholder:text-outline"
          />
        </div>
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-low rounded-md border border-outline-variant/30">
          <Utensils className="w-4 h-4 text-outline shrink-0" />
          <input
            type="text"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="Carbs (e.g. 42 g)"
            aria-label="Carbohydrates in grams"
            className="w-full bg-transparent text-on-surface font-body-sm text-body-sm outline-none placeholder:text-outline"
          />
        </div>
      </div>

      {/* Record Reading Submit Action */}
      <button
        type="button"
        onClick={handleRecord}
        disabled={loading}
        className="w-full py-2 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg shadow-sm hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        {message ? (
          <>
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Reading Recorded</span>
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            <span>{loading ? 'Recording...' : 'Record Reading'}</span>
          </>
        )}
      </button>

    </div>
  );
};
