import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { KpiCards } from '../components/dashboard/KpiCards';
import { MetabolicStabilityCard } from '../components/dashboard/MetabolicStabilityCard';
import { QuickGlucoseLogCard } from '../components/dashboard/QuickGlucoseLogCard';
import { AmbulatoryGlucoseProfileChart } from '../components/dashboard/AmbulatoryGlucoseProfileChart';
import { SlotComplianceMatrix } from '../components/dashboard/SlotComplianceMatrix';
import { TirDistributionGauge } from '../components/dashboard/TirDistributionGauge';
import { SlotCard } from '../components/SlotCard';
import { QuickLogModal } from '../components/QuickLogModal';
import { ClinicalReportModal } from '../components/ClinicalReportModal';
import { OnboardingTour } from '../components/OnboardingTour';
import {
  PlusCircle,
  Filter,
  Download,
  AlertCircle,
  Layers
} from 'lucide-react';

const SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
];

export const Dashboard = ({ selectedDate, onDateChange, onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const [readings, setReadings] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Overview');
  const [showMilestones, setShowMilestones] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Modal state for detailed logging
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');

    try {
      const [readingsRes, reportsRes] = await Promise.all([
        api.get(`/api/readings?date=${selectedDate}`),
        api.get(`/api/reports?date=${selectedDate}`)
      ]);

      setReadings(readingsRes.readings || []);
      setReports(reportsRes);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenAdd = (targetSlot) => {
    setEditingReading(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reading) => {
    setEditingReading(reading);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blood glucose reading?')) {
      return;
    }
    try {
      await api.delete(`/api/readings/${id}`);
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete reading');
    }
  };

  const handleSaveReading = async (data) => {
    try {
      if (editingReading) {
        await api.put(`/api/readings/${editingReading.id}`, data);
      } else {
        await api.post('/api/readings', data);
      }
      setIsModalOpen(false);
      setEditingReading(null);
      await fetchDashboardData();
    } catch (err) {
      throw err;
    }
  };

  const slotMap = readings.reduce((acc, r) => {
    acc[r.slot] = r;
    return acc;
  }, {});

  const existingSlotsForDate = readings.map(r => r.slot);

  return (
    <div className="flex flex-col w-full space-y-6">
      
      {/* 1. Sub-Header & Global Canvas Toolbar matching Stitch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg pb-space-sm border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Telemetry Live
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Continuous glucose telemetry &amp; ambulatory metabolic care snapshot
          </p>
        </div>

        {/* Actions & Segmented Navigation matching Stitch */}
        <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto">
          <div className="flex items-center p-1 bg-surface-container-low rounded-full border border-outline-variant/30 font-label-md text-label-md overflow-x-auto max-w-full">
            {['Overview', 'Fasting', 'Post-Meal', 'Sensor AGP'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap text-xs sm:text-sm ${
                  activeFilter === tab
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              type="button"
              onClick={() => alert('Widget customizer: All 6 core clinical widgets active.')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-on-surface font-label-md text-label-md shadow-xs hover:bg-surface-container-low transition-all text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" />
              <span>Add Widget</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMilestones(!showMilestones)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-on-surface font-label-md text-label-md shadow-xs hover:bg-surface-container-low transition-all text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-outline" />
              <span>{showMilestones ? 'Hide Slots' : 'Meal Slots'}</span>
            </button>
            <button
              id="tour-export-button"
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-xs hover:bg-primary-container active:scale-95 transition-all cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Optional Collapsible Meal Milestones (Today's 4 Slots) */}
      {showMilestones && (
        <div id="tour-checkpoints" className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-on-surface">
                Today's 4 Milestone Checkpoints
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface">
                {readings.length} / 4 Recorded
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SLOTS.map((slotName) => (
              <SlotCard
                key={slotName}
                slot={slotName}
                reading={slotMap[slotName]}
                onAdd={() => handleOpenAdd(slotName)}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. KPI Metric Summary Row (4 Cards) */}
      <KpiCards
        daily={reports?.daily}
        mtd={reports?.mtd}
        readingsCount={readings.length}
      />

      {/* 3. Middle Bento Grid (Metabolic Stability & Fast Log + AGP Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md mb-space-lg min-w-0">
        
        {/* Left Column (4 cols): Metabolic Stability + Quick Log Card */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-space-md min-w-0">
          <MetabolicStabilityCard score={88} change="+1.2" readingsCount={readings.length} />
          <div id="tour-quick-log">
            <QuickGlucoseLogCard
              onSaveReading={handleSaveReading}
              existingSlots={existingSlotsForDate}
            />
          </div>
        </div>

        {/* Right Column (8 cols): Ambulatory Glucose Profile (AGP) */}
        <div className="lg:col-span-8 xl:col-span-8 min-w-0">
          <AmbulatoryGlucoseProfileChart 
            trendData={reports?.trend || []} 
            onOpenLog={() => handleOpenAdd('Morning (fasting)')}
          />
        </div>

      </div>

      {/* 4. Bottom Row (2 Columns): Weekly Heatmap Schedule Matrix & Segmented Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md min-w-0">
        
        {/* Left: Schedule Compliance Matrix (7 cols) */}
        <div className="lg:col-span-7 min-w-0">
          <SlotComplianceMatrix dailyReadings={readings} />
        </div>

        {/* Right: TIR Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 min-w-0">
          <TirDistributionGauge distribution={reports?.distribution} />
        </div>

      </div>

      {/* Quick Log Modal for detailed logging */}
      <QuickLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReading}
        editingReading={editingReading}
        defaultDate={selectedDate}
        existingSlotsForDate={existingSlotsForDate}
      />

      {/* Clinical AGP Report Export Modal */}
      <ClinicalReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        selectedDate={selectedDate}
      />

      {/* One-time Interactive Onboarding Tour for New User */}
      <OnboardingTour />

    </div>
  );
};

export default Dashboard;
