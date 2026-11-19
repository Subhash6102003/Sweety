import React from 'react';
import { Plus, Edit2, Trash2, Sun, Coffee, Utensils, Moon } from 'lucide-react';

const SLOT_META = {
  'Morning (fasting)': {
    icon: Sun,
    label: 'Morning (fasting)',
    desc: 'Before breakfast'
  },
  'After breakfast': {
    icon: Coffee,
    label: 'After breakfast',
    desc: '2 hours post-meal'
  },
  'After lunch': {
    icon: Utensils,
    label: 'After lunch',
    desc: '2 hours post-meal'
  },
  'After dinner': {
    icon: Moon,
    label: 'After dinner',
    desc: '2 hours post-meal'
  }
};

const getStatusBadge = (value) => {
  if (value < 70) {
    return {
      text: 'Low',
      bg: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }
  if (value <= 140) {
    return {
      text: 'In Target',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }
  return {
    text: 'Elevated',
    bg: 'bg-amber-50 text-amber-700 border-amber-200'
  };
};

export const SlotCard = ({ slot, reading, onAdd, onEdit, onDelete }) => {
  const meta = SLOT_META[slot] || { icon: Sun, label: slot, desc: '' };
  const Icon = meta.icon;

  if (!reading) {
    return (
      <div className="relative group rounded-3xl border-2 border-dashed border-gray-200 hover:border-theme-primary/50 bg-white/60 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:bg-white min-h-[170px]">
        <div>
          <div className="flex items-center space-x-2 text-gray-400 group-hover:text-theme-primary transition-colors">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold">{meta.label}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{meta.desc}</p>
        </div>

        <div className="my-auto py-2 text-center">
          <span className="text-xs font-medium text-gray-400 italic">No reading recorded</span>
        </div>

        <button
          onClick={() => onAdd(slot)}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-2xl bg-gray-50 hover:bg-theme-primary text-gray-600 hover:text-white text-xs font-bold transition-all duration-200 group-hover:bg-theme-primary-light group-hover:text-theme-primary"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Log Slot</span>
        </button>
      </div>
    );
  }

  const badge = getStatusBadge(reading.value);

  return (
    <div className="relative rounded-3xl border border-theme-border bg-white p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 min-h-[170px] group">
      {/* Header with Slot & Status Badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-theme-primary">
          <div className="p-1.5 rounded-xl bg-theme-primary-light">
            <Icon className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">{meta.label}</h4>
            <span className="text-[10px] text-gray-400">{meta.desc}</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
          {badge.text}
        </span>
      </div>

      {/* Glucose Value Display */}
      <div className="my-3">
        <div className="flex items-baseline space-x-1.5">
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tabular-nums tracking-tight">
            {reading.value}
          </span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            mg/dL
          </span>
        </div>
      </div>

      {/* Footer with Edit / Delete Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-[10px] font-medium text-gray-400">
          {reading.created_at ? new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(reading)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-theme-primary hover:bg-theme-primary-light transition-colors"
            title="Edit reading"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(reading.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete reading"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
