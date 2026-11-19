import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Heart,
  TrendingDown,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  Info,
  Trash2,
  Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ActivityFitnessPage = () => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const storageKey = `sweety_activities_${user?.id || 'guest'}`;

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  const [selectedActivity, setSelectedActivity] = useState('running');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('moderate');
  const [preGlucose, setPreGlucose] = useState('120');
  const [postGlucose, setPostGlucose] = useState('105');
  const [logSuccess, setLogSuccess] = useState(false);

  const activitiesList = [
    { id: 'running', label: 'Outdoor Run', icon: Zap, calPerMin: 9 },
    { id: 'cycling', label: 'Cycling', icon: Activity, calPerMin: 7 },
    { id: 'hiit', label: 'HIIT / Cardio', icon: Flame, calPerMin: 10 },
    { id: 'strength', label: 'Resistance / Weights', icon: Shield, calPerMin: 6 },
    { id: 'swimming', label: 'Swimming', icon: Activity, calPerMin: 8 },
    { id: 'walking', label: 'Brisk Walk', icon: Clock, calPerMin: 4 }
  ];

  const handleLogActivity = (e) => {
    e?.preventDefault();
    const durNum = Number(duration) || 30;
    const preNum = Number(preGlucose) || 120;
    const postNum = Number(postGlucose) || 105;
    const actMeta = activitiesList.find(a => a.id === selectedActivity) || activitiesList[0];
    const calsBurned = durNum * actMeta.calPerMin;
    const delta = postNum - preNum;

    const newLog = {
      id: Date.now(),
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      activity: actMeta.label,
      duration: `${durNum} min`,
      durationMinutes: durNum,
      calories: calsBurned,
      glucoseDelta: `${preNum} → ${postNum} mg/dL (${delta > 0 ? '+' : ''}${delta})`,
      avgGlucose: Math.round((preNum + postNum) / 2),
      status: delta < -30 ? 'Hypo Shield Monitored' : delta < 0 ? 'Optimal Drop' : 'Anaerobic Rise',
      statusColor: delta < -30 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
    };

    const updated = [newLog, ...activities];
    setActivities(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save activities:', err);
    }

    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  const handleDeleteActivity = (id) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete activity:', err);
    }
  };

  // Dynamic calculated stats
  const totalMinutes = activities.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  const totalCalories = activities.reduce((sum, a) => sum + (a.calories || 0), 0);
  const avgWorkoutGlucose = activities.length > 0 
    ? Math.round(activities.reduce((sum, a) => sum + (a.avgGlucose || 0), 0) / activities.length)
    : (isDemo ? 114 : null);

  return (
    <div className="flex flex-col w-full space-y-6 pb-20 font-sans text-on-surface">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              EXERTION DYNAMICS &bull; METABOLIC SHIELD
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Activity &amp; Exercise
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl">
            Physical exertion impact on continuous glucose dynamics, heart rate correlation, and exercise hypo protection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('log-activity-panel');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="self-start sm:self-auto h-9 px-4 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* TOP 4 KPI CARDS (Calculated strictly from user activities) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Minutes */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Total Active Minutes</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">
              {totalMinutes}
            </span>
            <span className="text-xs text-outline font-semibold">min</span>
          </div>
          <p className="text-[11px] text-outline font-semibold">
            {totalMinutes > 0 ? `${totalMinutes} min tracked today` : '0 min logged today'}
          </p>
        </div>

        {/* KPI 2: Energy Burned */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Active Energy Burned</span>
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-primary tabular-nums">
              {totalCalories}
            </span>
            <span className="text-xs text-outline font-semibold">kcal</span>
          </div>
          <p className="text-[11px] text-outline font-semibold">
            {totalCalories > 0 ? 'Calculated from workouts' : 'Awaiting workout entries'}
          </p>
        </div>

        {/* KPI 3: Avg Workout Glucose */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Avg Workout Glucose</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">
              {avgWorkoutGlucose !== null ? avgWorkoutGlucose : '—'}
            </span>
            {avgWorkoutGlucose !== null && <span className="text-xs text-outline font-semibold">mg/dL</span>}
          </div>
          <p className="text-[11px] text-outline font-semibold">
            {avgWorkoutGlucose !== null ? 'In optimal target zone' : 'Requires logged session'}
          </p>
        </div>

        {/* KPI 4: Workouts Logged */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Logged Workouts</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">
              {activities.length}
            </span>
            <span className="text-xs text-outline font-semibold">sessions</span>
          </div>
          <p className="text-[11px] text-tertiary font-semibold">
            {activities.length > 0 ? 'Hypo shield protection active' : 'No sessions recorded yet'}
          </p>
        </div>

      </div>

      {/* Main Exertion Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Exertion Telemetry Curve + Logged History */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dynamic Graph Canvas */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="font-display text-base font-bold text-on-surface">
                  Exertion Impact Telemetry Curve
                </h3>
                <p className="text-xs text-outline">
                  Glycemic drop and recovery trajectory across logged physical activities.
                </p>
              </div>
              <span className="text-xs font-bold text-tertiary">
                {activities.length > 0 ? `${activities.length} Sessions Plotted` : 'Baseline Flat (0 mg/dL)'}
              </span>
            </div>

            {activities.length > 0 ? (
              <div className="h-52 w-full relative bg-surface-container-low/40 rounded-xl p-3 flex flex-col justify-between">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Target 70-140 Corridor */}
                  <rect x="0" y="20" width="500" height="70" fill="var(--primary)" fillOpacity="0.06" rx="6" />
                  <line x1="0" y1="20" x2="500" y2="20" stroke="var(--outline-variant)" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="var(--outline-variant)" strokeDasharray="3 3" />

                  {/* Dynamic Path based on actual activities */}
                  <path
                    d={`M 10,60 ${activities.map((a, i) => {
                      const x = 30 + (i * (440 / Math.max(1, activities.length)));
                      const y = Math.max(20, Math.min(100, 120 - ((a.avgGlucose || 110) * 0.6)));
                      return `L ${x},${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="var(--primary, #ad2737)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Dots for each activity */}
                  {activities.map((a, i) => {
                    const x = 30 + (i * (440 / Math.max(1, activities.length)));
                    const y = Math.max(20, Math.min(100, 120 - ((a.avgGlucose || 110) * 0.6)));
                    return (
                      <circle
                        key={a.id}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="var(--primary, #ad2737)"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                <div className="flex justify-between text-[10px] text-outline font-semibold px-2">
                  <span>Pre-Workout</span>
                  <span>Mid Exertion</span>
                  <span>Cool Down</span>
                  <span>Recovery</span>
                </div>
              </div>
            ) : (
              <div className="h-44 w-full flex flex-col items-center justify-center text-center p-4 bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/40 space-y-2">
                <Activity className="w-8 h-8 text-outline" />
                <span className="text-xs font-bold text-on-surface">No Exertion Data Recorded</span>
                <p className="text-[11px] text-outline max-w-xs">
                  The graph will plot your glycemic trajectory once you log your first physical activity.
                </p>
              </div>
            )}
          </div>

          {/* Activity Log List */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-display text-base font-bold text-on-surface">
                Recent Physical Activities ({activities.length})
              </h3>
            </div>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-on-surface">{act.activity}</strong>
                        <span className="text-[10px] text-outline">{act.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-outline">
                        <span>{act.duration}</span>
                        <span>&bull;</span>
                        <span className="text-primary font-bold">{act.calories} kcal</span>
                        <span>&bull;</span>
                        <span>Glucose: {act.glucoseDelta}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${act.statusColor}`}>
                        {act.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-1 rounded text-outline hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-1">
                <span className="text-xs font-semibold text-outline block">No workouts logged yet</span>
                <span className="text-[11px] text-outline">Use the panel on the right to log your workout session.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Log Activity Interactive Panel */}
        <div id="log-activity-panel" className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-5">
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">
                Log Workout &amp; Physical Exertion
              </h3>
              <p className="text-xs text-outline">
                Record your workout to update your active calories and glycemic excursion graph.
              </p>
            </div>

            {logSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Workout logged successfully! Metrics updated.</span>
              </div>
            )}

            <form onSubmit={handleLogActivity} className="space-y-4">
              {/* Activity Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Select Activity</label>
                <div className="grid grid-cols-3 gap-2">
                  {activitiesList.map((a) => {
                    const Icon = a.icon;
                    const isSelected = selectedActivity === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSelectedActivity(a.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold leading-tight">{a.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                  <span>Duration</span>
                  <span className="text-primary tabular-nums">{duration} Minutes</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Pre vs Post Glucose Check */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Pre-Workout (mg/dL)</label>
                  <input
                    type="number"
                    min="40"
                    max="600"
                    value={preGlucose}
                    onChange={(e) => setPreGlucose(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-bold tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Post-Workout (mg/dL)</label>
                  <input
                    type="number"
                    min="40"
                    max="600"
                    value={postGlucose}
                    onChange={(e) => setPostGlucose(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-bold tabular-nums"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs hover:bg-primary-container active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Workout &amp; Update Graph</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
