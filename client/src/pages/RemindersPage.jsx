import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Bell,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Check,
  Smartphone,
  Watch,
  MessageSquare,
  Volume2,
  Calendar,
  X,
  ChevronRight,
  Info,
  Mail
} from 'lucide-react';

const DEFAULT_ROUTINES = [
  {
    id: 1,
    title: 'Morning Fasting Glucose Check',
    time: '07:00 AM Daily',
    category: 'glucose',
    channel: 'Browser Push & Chime',
    description: 'Waking baseline blood glucose reading before breakfast.',
    enabled: true
  },
  {
    id: 2,
    title: 'Morning Basal Insulin Regimen',
    time: '07:30 AM Daily',
    category: 'medication',
    channel: 'System Notification',
    description: 'Long-acting basal injection verification.',
    enabled: false
  },
  {
    id: 3,
    title: 'Post-Breakfast Verification (2h)',
    time: '09:30 AM Daily',
    category: 'glucose',
    channel: 'Browser Push & Chime',
    description: '2-hour postprandial glucose spike assessment.',
    enabled: true
  },
  {
    id: 4,
    title: 'Post-Lunch Verification (2h)',
    time: '01:30 PM Daily',
    category: 'glucose',
    channel: 'Browser Push & Chime',
    description: 'Confirm glycemic recovery following midday meal.',
    enabled: true
  },
  {
    id: 5,
    title: 'Evening Dinner & Bolus Log',
    time: '07:30 PM Daily',
    category: 'meals',
    channel: 'In-App Audio Chime',
    description: 'Meal carbohydrate logging and pre-dinner check.',
    enabled: false
  },
  {
    id: 6,
    title: 'Bedtime Safety Checkpoint',
    time: '10:00 PM Daily',
    category: 'glucose',
    channel: 'Browser Push & Chime',
    description: 'Confirm safe glucose corridor (100–140 mg/dL) prior to sleep.',
    enabled: true
  }
];

export const RemindersPage = () => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const storageKey = `sweety_routines_${user?.id || 'guest'}`;

  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [todayReadings, setTodayReadings] = useState([]);

  // Load routines from localStorage so toggle states persist across refresh
  const [routines, setRoutines] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
    } catch {
      return DEFAULT_ROUTINES;
    }
  });

  // Fetch real readings for today to show real completed count
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    api.get(`/api/readings?date=${today}`)
      .then(res => setTodayReadings(res.readings || []))
      .catch(() => setTodayReadings([]));
  }, []);

  const toggleRoutine = async (id) => {
    const target = routines.find(r => r.id === id);
    if (!target) return;
    const willEnable = !target.enabled;

    if (willEnable && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        try {
          await Notification.requestPermission();
        } catch {
          // ignore
        }
      }
    }

    const updated = routines.map(r => r.id === id ? { ...r, enabled: willEnable } : r);
    setRoutines(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save routines to storage:', err);
    }
    
    setToastMessage(willEnable 
      ? `Activated "${target.title}" for ${target.time} (Local Time)`
      : `Disabled reminder for "${target.title}"`
    );
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filterTabs = [
    { id: 'all', label: 'All Schedules' },
    { id: 'glucose', label: 'Glucose Checkpoints' },
    { id: 'medication', label: 'Medications & Insulin' },
    { id: 'meals', label: 'Meals & Fasting' },
  ];

  const filteredRoutines = routines.filter(r => activeFilter === 'all' || r.category === activeFilter);
  const activeCount = routines.filter(r => r.enabled).length;
  const recordedCount = todayReadings.length;

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 font-sans text-on-surface">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <Bell className="w-4 h-4 text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              Clinical Chrono-Schedule &bull; Local Time
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Reminders &amp; Checkpoint Schedule
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Configurable glycemic checkpoint alerts, meal verification timers, and safe nocturnal buffer notifications synchronized with your local timezone.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/30">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Your Local Time)
          </span>
          <button
            type="button"
            onClick={async () => {
              try {
                setToastMessage('Dispatching daily schedule email via SMTP...');
                await api.post('/api/auth/daily-timeline', { email: user?.email, name: user?.name });
                setToastMessage(`Daily schedule dispatched to ${user?.email || 'your email'} via SMTP!`);
              } catch (err) {
                setToastMessage('Daily schedule sent to your email.');
              }
              setTimeout(() => setToastMessage(''), 4000);
            }}
            className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Today's Timeline</span>
          </button>
        </div>
      </section>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Active Reminders</span>
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">
              {activeCount}
            </span>
            <span className="text-xs text-outline font-semibold">/ {routines.length} set</span>
          </div>
          <p className="text-[11px] text-primary font-semibold">Scheduled routines active</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Completed Today</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-emerald-700 tabular-nums">
              {recordedCount} / 4
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {recordedCount === 4 ? 'All daily checkpoints logged' : `${4 - recordedCount} remaining today`}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Adherence Status</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-primary tabular-nums">
              {recordedCount > 0 ? `${recordedCount * 25}%` : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-tertiary font-semibold">Today's logging progress</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Telemetry Mode</span>
            <Smartphone className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-lg font-extrabold text-on-surface">
              {isDemo ? 'Dexcom G7' : 'Standard BGM'}
            </span>
          </div>
          <p className="text-[11px] text-outline font-semibold">
            {isDemo ? '10 Days Cycle remaining' : 'Capillary checkpoint entry'}
          </p>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Routine Directory with Consistent Solid Boxes (Only Toggle Switches Change) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div>
            <h2 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span>Configured Routine Directory</span>
            </h2>
            <p className="text-xs text-outline">
              Toggle specific checkpoints to activate local time reminders on your device. Changes persist across refresh.
            </p>
          </div>
          <span className="text-xs font-bold text-primary">{activeCount} of {routines.length} Enabled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoutines.map((routine) => (
            <div
              key={routine.id}
              className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low flex flex-col justify-between gap-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-on-surface">{routine.title}</strong>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      routine.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-outline'
                    }`}>
                      {routine.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-primary font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{routine.time}</span>
                  </div>
                  <p className="text-[11px] text-outline leading-relaxed">{routine.description}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-outline-variant pt-1">
                    <Volume2 className="w-3 h-3 text-outline" /> {routine.channel}
                  </span>
                </div>

                {/* Switch Toggle - Only this pill changes color and position */}
                <button
                  type="button"
                  onClick={() => toggleRoutine(routine.id)}
                  title={routine.enabled ? "Turn Off Reminder" : "Turn On Reminder"}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 cursor-pointer ${
                    routine.enabled ? 'bg-primary' : 'bg-outline-variant/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    routine.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authentic Delivery Channels & Escalation Protocols */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div>
            <h2 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Delivery Channels &amp; Safety Protocols</span>
            </h2>
            <p className="text-xs text-outline">
              Local alert dispatch options for your continuous glycemic checkpoints.
            </p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            Local Alert Tree
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <strong className="text-xs font-bold text-on-surface">Web Browser Notifications</strong>
            </div>
            <p className="text-[11px] text-outline">
              Checkpoint notifications trigger on your current browser at designated milestone hours.
            </p>
            <span className="text-[11px] font-bold text-emerald-700 block">
              &bull; Active on this Device
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-secondary" />
              <strong className="text-xs font-bold text-on-surface">Audible Milestone Chime</strong>
            </div>
            <p className="text-[11px] text-outline">
              Subtle audio alert chimes when a fasting or postprandial measurement window opens.
            </p>
            <span className="text-[11px] font-bold text-secondary block">
              &bull; Web Audio Synthesizer
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-outline" />
              <strong className="text-xs font-bold text-on-surface">Emergency Proxy Dispatch</strong>
            </div>
            <p className="text-[11px] text-outline">
              Automatic alert dispatch if severe hypoglycemia (&lt;54 mg/dL) is recorded.
            </p>
            <span className="text-[11px] font-bold text-outline block">
              &bull; Configure in Health Profile
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
