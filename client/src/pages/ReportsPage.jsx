import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Filter, Inbox, ArrowRight } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ReportCards } from '../components/ReportCards';
import { ClinicalReportModal } from '../components/ClinicalReportModal';

export const ReportsPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [reports, setReports] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const fetchReports = async (dateStr) => {
    setLoading(true);
    try {
      const [reportsData, readingsData] = await Promise.all([
        api.get(`/api/reports?date=${dateStr}`),
        api.get('/api/readings').catch(() => ({ readings: [] }))
      ]);
      setReports(reportsData);
      setReadings(readingsData?.readings || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(selectedDate);
  }, [selectedDate]);

  const handleExportCsv = () => {
    let csvRows = ["Date,Slot,Glucose_mg_dL,Status"];
    
    if (readings && readings.length > 0) {
      readings.forEach(r => {
        const status = r.value < 70 ? 'Low' : r.value <= 140 ? 'In-Range' : 'High';
        csvRows.push(`${r.reading_date},"${r.slot}",${r.value},${status}`);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sweety_readings_${user?.name?.toLowerCase().replace(/\s+/g, '_') || 'patient'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 font-sans text-on-surface">
      
      {/* Top Command & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
              Clinical Reports Engine
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-outline text-xs font-semibold">ADA Consensus Standards</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Reports &amp; Analytics
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl">
            Calculated summary statistics (Highest, Lowest, Average, and Count) across Daily, Month-to-date, and Previous Month periods.
          </p>
        </div>

        {/* Actions & Quick Export */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-on-surface rounded-xl text-xs font-bold shadow-xs hover:bg-surface-container-low border border-outline-variant/40 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Raw CSV ({readings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Print Official AGP Report</span>
          </button>
        </div>
      </div>

      {/* Date Selector Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Selected Reporting Date
            </span>
            <span className="text-xs font-extrabold text-on-surface">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-outline">Change Target Date:</label>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-bold text-on-surface cursor-pointer"
          />
        </div>
      </div>

      {/* 3 Required Report Cards (Daily, MTD, Previous Month) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-on-surface">
            Clinical Summary Reports
          </h2>
          <span className="text-xs text-outline font-semibold">
            {loading ? 'Recalculating...' : 'Synchronized with Supabase'}
          </span>
        </div>

        <ReportCards reports={reports} />
      </section>

      {/* Printable Clinical AGP Modal */}
      <ClinicalReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        selectedDate={selectedDate}
      />

    </div>
  );
};
