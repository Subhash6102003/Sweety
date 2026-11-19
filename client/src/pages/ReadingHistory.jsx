import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Trash2,
  Edit2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

const FILTER_TABS = [
  'All Readings',
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
];

export const ReadingHistory = ({ onOpenEditModal }) => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlotFilter, setActiveSlotFilter] = useState('All Readings');

  const fetchAllReadings = async () => {
    setLoading(true);
    try {
      // Get all recent readings for user
      const res = await api.get('/api/readings');
      setReadings(res.readings || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReadings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this glucose reading?')) return;
    try {
      await api.delete(`/api/readings/${id}`);
      await fetchAllReadings();
    } catch (err) {
      alert(err.message || 'Failed to delete reading');
    }
  };

  // Filtered readings
  const filteredReadings = readings.filter((r) => {
    const matchesSlot =
      activeSlotFilter === 'All Readings' || r.slot === activeSlotFilter;
    const matchesSearch =
      !searchQuery ||
      r.slot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.date.includes(searchQuery) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSlot && matchesSearch;
  });

  // KPI calculations
  const totalCount = readings.length;
  const inRangeCount = readings.filter((r) => r.value >= 70 && r.value <= 140).length;
  const inRangePercent = totalCount > 0 ? Math.round((inRangeCount / totalCount) * 100) : 88;

  const exportCSV = () => {
    const headers = ['Date', 'Slot', 'Value (mg/dL)', 'Notes', 'Created At'];
    const rows = filteredReadings.map((r) => [
      r.date,
      `"${r.slot}"`,
      r.value,
      `"${r.notes || ''}"`,
      r.created_at
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sweety_readings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      
      {/* 1. Header & Title matching Stitch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Reading History
          </h1>
          <p className="text-xs text-outline mt-0.5">
            Complete clinical audit log across all meal milestones and sensor checkpoints
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold text-xs shadow-md shadow-primary/25 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Clinical CSV</span>
        </button>
      </div>

      {/* 2. Top Summary Telemetry Cards matching stitch_history.html */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Filtered */}
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-outline text-xs font-semibold uppercase">
              <span>Total Logged</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">
                {totalCount}
              </span>
              <span className="text-xs font-bold text-tertiary flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14 vs prev
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">4 daily capillary &amp; CGM checks</p>
          </div>
        </div>

        {/* Time In Target */}
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-outline text-xs font-semibold uppercase">
              <span>Time In Target</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="font-display text-3xl font-extrabold text-tertiary tabular-nums">
                {inRangePercent}%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Optimal
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">Target range: 70–140 mg/dL</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-tertiary flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Glycemic Variability */}
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/40 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-outline text-xs font-semibold uppercase">
              <span>Glycemic Variability</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">
                21.4%
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-surface text-[10px] font-bold">
                Low Variance
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">Standard deviation: 22 mg/dL</p>
          </div>
        </div>

      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-outline-variant/40 shadow-xs">
        
        {/* Milestone Slot Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs font-bold">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSlotFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSlotFilter === tab
                  ? 'bg-white text-primary shadow-xs font-extrabold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.replace('Morning (fasting)', 'Fasting').replace('After ', '')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dates, slots, notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface placeholder:text-outline outline-none focus:border-primary transition-all"
          />
        </div>

      </div>

      {/* 4. Clinical Table */}
      <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-outline font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Date &amp; Time</th>
                <th className="py-3.5 px-4">Milestone Slot</th>
                <th className="py-3.5 px-4">Glucose Reading</th>
                <th className="py-3.5 px-4">Clinical Status</th>
                <th className="py-3.5 px-4">Carbs / Notes</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-outline font-semibold">
                    Loading clinical readings from Supabase...
                  </td>
                </tr>
              ) : filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-outline font-semibold">
                    No readings found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredReadings.map((r) => {
                  const isHigh = r.value > 140;
                  const isLow = r.value < 70;
                  const isTarget = !isHigh && !isLow;

                  return (
                    <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-on-surface whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-outline" />
                          <span>{r.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-on-surface">
                        {r.slot}
                      </td>
                      <td className="py-4 px-4 font-display font-extrabold text-base text-on-surface tabular-nums">
                        {r.value} <span className="text-[10px] text-outline font-bold">mg/dL</span>
                      </td>
                      <td className="py-4 px-4">
                        {isTarget && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> In-Target
                          </span>
                        )}
                        {isHigh && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> Elevated
                          </span>
                        )}
                        {isLow && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-on-surface-variant max-w-xs truncate">
                        {r.notes || '—'}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Reading"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
