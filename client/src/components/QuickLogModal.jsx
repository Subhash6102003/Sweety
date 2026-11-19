import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

const SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
];

export const QuickLogModal = ({ isOpen, onClose, onSave, editingReading, defaultDate, existingSlotsForDate = [] }) => {
  const [date, setDate] = useState(defaultDate);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (editingReading) {
      setDate(editingReading.reading_date);
      setSlot(editingReading.slot);
      setValue(editingReading.value.toString());
    } else {
      setDate(defaultDate || todayStr);
      // Pick first unlogged slot if available
      const unlogged = SLOTS.find(s => !existingSlotsForDate.includes(s));
      setSlot(unlogged || SLOTS[0]);
      setValue('');
    }
    setError('');
  }, [editingReading, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Rule 1: Value is required
    if (!value || value.trim() === '') {
      setError('Please enter a glucose value.');
      return;
    }

    // Rule 2: Whole number between 40 and 600
    const num = Number(value);
    if (!Number.isInteger(num) || num < 40 || num > 600) {
      setError('Value must be between 40 and 600 mg/dl.');
      return;
    }

    // Rule 5: Date cannot be in the future
    if (date > todayStr) {
      setError('Date cannot be in the future.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        id: editingReading?.id,
        date,
        slot,
        value: num
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save glucose reading.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900">
              {editingReading ? 'Edit Glucose Reading' : 'Log Blood Glucose'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Record your meal milestone reading in mg/dL
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Error Alert Banner */}
          {error && (
            <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Date Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Reading Date
            </label>
            <input
              type="date"
              value={date}
              max={todayStr}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-sm font-semibold text-gray-800 transition-all cursor-pointer"
              required
            />
          </div>

          {/* Slot Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((s) => {
                const isTaken = !editingReading && existingSlotsForDate.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isTaken}
                    onClick={() => setSlot(s)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-bold text-left transition-all border ${
                      slot === s
                        ? 'bg-theme-primary-light border-theme-primary text-theme-primary shadow-xs'
                        : isTaken
                        ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{s}</span>
                      {isTaken && <span className="text-[10px] text-gray-400 font-normal">Logged</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blood Glucose Value */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Blood Glucose Value
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 110"
                min="40"
                max="600"
                step="1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-4 pr-16 py-3 rounded-2xl border border-gray-200 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-lg font-bold text-gray-900 tabular-nums transition-all"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                mg/dL
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Valid range: 40 to 600 mg/dL (whole number)
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-md shadow-theme-primary/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingReading ? 'Update Reading' : 'Save Reading'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
