import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  FileText,
  Printer,
  Download,
  X,
  Shield,
  Activity,
  CheckCircle2,
  Calendar,
  User,
  Heart,
  Inbox
} from 'lucide-react';

export const ClinicalReportModal = ({ isOpen, onClose, selectedDate = new Date().toISOString().split('T')[0] }) => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const [readings, setReadings] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      api.get('/api/readings').catch(() => ({ readings: [] })),
      api.get(`/api/reports?date=${selectedDate}`).catch(() => null)
    ])
      .then(([readingsRes, reportsRes]) => {
        setReadings(readingsRes?.readings || []);
        setReports(reportsRes);
      })
      .finally(() => setLoading(false));
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  // Real metric calculations from Supabase readings
  const hasReadings = readings.length > 0;
  let totalCount = readings.length;
  
  let lowestVal = '—';
  let highestVal = '—';
  let avgVal = '—';
  let tirPercent = '—';

  if (hasReadings) {
    const vals = readings.map(r => r.value);
    lowestVal = Math.min(...vals);
    highestVal = Math.max(...vals);
    const sum = vals.reduce((a, b) => a + b, 0);
    avgVal = (sum / vals.length).toFixed(1);

    const inRange = vals.filter(v => v >= 70 && v <= 140).length;
    tirPercent = `${Math.round((inRange / vals.length) * 100)}%`;
  } else if (isDemo) {
    totalCount = 120;
    lowestVal = 74;
    highestVal = 158;
    avgVal = '125.5';
    tirPercent = '88.0%';
  }

  const handlePrint = () => {
    const reportEl = document.getElementById('official-clinical-agp-report');
    if (!reportEl) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'agp-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '800px';
    iframe.style.height = '1200px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();

    const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(tag => tag.outerHTML)
      .join('\n');

    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Sweety AGP Clinical Report - ${user?.name || 'Patient'}</title>
          ${styleTags}
          <style>
            @page {
              size: letter portrait;
              margin: 10mm 12mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 12px !important;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; max-width: 800px; margin: 0 auto; background: #ffffff;">
            ${reportEl.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 4000);
      }
    }, 400);
  };

  const handleDownloadCsv = () => {
    let csvRows = ["Date,Slot,Glucose_mg_dL,Target_Range,Status"];
    
    if (readings && readings.length > 0) {
      readings.forEach(r => {
        const status = r.value < 70 ? 'Low' : r.value <= 140 ? 'In-Range' : 'High';
        csvRows.push(`${r.reading_date},"${r.slot}",${r.value},70-140,${status}`);
      });
    } else if (isDemo) {
      csvRows.push("2026-11-19,Morning (fasting),98,70-140,In-Range");
      csvRows.push("2026-11-19,After breakfast,121,70-140,In-Range");
      csvRows.push("2026-11-19,After lunch,129,70-140,In-Range");
      csvRows.push("2026-11-19,After dinner,115,70-140,In-Range");
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sweety_agp_${user?.name?.toLowerCase().replace(/\s+/g, '_') || 'patient'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const patientName = user?.name || (isDemo ? 'Elena Vance' : 'Patient');
  const patientEmail = user?.email || '';
  const patientMrn = user?.mrn || 'MRN: Pending';
  const patientDiagnosis = user?.diagnosis || 'Type 1 Diabetes';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Control Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0 no-print">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-tight">
                Official Clinical Ambulatory Glucose Profile (AGP) Report
              </h3>
              <p className="text-[11px] text-slate-400">
                Endocrine Society &amp; ADA Consensus &bull; {hasReadings ? `${readings.length} Logged Readings` : isDemo ? 'Demo Dataset' : '0 Readings Logged'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print AGP Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="official-clinical-agp-report" className="p-8 sm:p-10 overflow-y-auto bg-white text-slate-900 print:p-0">
          
          {/* Header Banner */}
          <div className="pb-6 mb-6 border-b-2 border-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600" />
                  <span className="font-display text-xl font-black tracking-tight text-slate-900">
                    SWEETY CLINICAL TELEMETRY
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Ambulatory Glucose Profile (AGP) Clinical Consensus Report
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
                  {hasReadings ? 'AUTHENTIC PATIENT DATA' : isDemo ? 'DEMO DATASET' : 'EMPTY PATIENT FILE'}
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1">Date: {selectedDate}</p>
              </div>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Patient Name</span>
                <strong className="text-sm font-bold text-slate-900">{patientName}</strong>
                <span className="text-[11px] text-slate-600 block">{patientEmail}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Record Number</span>
                <strong className="text-sm font-bold text-slate-900">{patientMrn}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Primary Diagnosis</span>
                <strong className="text-xs font-bold text-slate-900">{patientDiagnosis}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Care Status</span>
                <strong className="text-xs font-bold text-slate-900">{isDemo ? 'Dr. Aris Thorne, MD' : 'Self-Monitored'}</strong>
              </div>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="mb-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
              1. Standard Glycemic Targets &amp; Time in Range (TIR)
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Time in Range (70–140 mg/dL)</span>
                <div className="text-2xl font-black text-emerald-900 tabular-nums">{tirPercent}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">{hasReadings ? 'Calculated from logs' : 'Goal: >70%'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Average Glucose</span>
                <div className="text-2xl font-black text-slate-900 tabular-nums">{avgVal} {hasReadings && 'mg/dL'}</div>
                <span className="text-[11px] text-slate-600 font-semibold">{hasReadings ? `${totalCount} readings` : 'No readings'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Lowest Reading</span>
                <div className="text-2xl font-black text-slate-900 tabular-nums">{lowestVal} {hasReadings && 'mg/dL'}</div>
                <span className="text-[11px] text-slate-600 font-semibold">Min checkpoint</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Highest Reading</span>
                <div className="text-2xl font-black text-rose-700 tabular-nums">{highestVal} {hasReadings && 'mg/dL'}</div>
                <span className="text-[11px] text-slate-600 font-semibold">Max checkpoint</span>
              </div>
            </div>
          </div>

          {/* Actual Logged Readings Table */}
          <div className="mb-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
              2. Recorded Daily Milestone Checkpoints
            </h4>
            {hasReadings ? (
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Slot Milestone</th>
                    <th className="py-2 px-3">Value (mg/dL)</th>
                    <th className="py-2 px-3">Clinical Target</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {readings.map((r) => {
                    const status = r.value < 70 ? 'Low' : r.value <= 140 ? 'In-Target' : 'Elevated';
                    const color = r.value < 70 ? 'text-amber-700' : r.value <= 140 ? 'text-emerald-700' : 'text-rose-700';
                    return (
                      <tr key={r.id}>
                        <td className="py-2 px-3 text-slate-600 font-medium">{r.reading_date}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{r.slot}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 tabular-nums">{r.value} mg/dL</td>
                        <td className="py-2 px-3 text-slate-600">70 – 140 mg/dL</td>
                        <td className={`py-2 px-3 text-right font-bold ${color}`}>{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
                <strong className="text-xs font-bold text-slate-700 block">No Blood Glucose Readings Recorded Yet</strong>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  When you record daily checkpoints (Morning fasting, After breakfast, After lunch, After dinner), they will be certified and listed here.
                </p>
              </div>
            )}
          </div>

          {/* Clinician Certification */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Report Verification</span>
              <span className="font-semibold text-slate-800">
                {hasReadings 
                  ? `Certified Ambulatory Telemetry Report for ${patientName}` 
                  : `Patient Account Created — Awaiting Telemetry Data`}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              SWEETY-AGP-UUID: {user?.id?.slice(0, 8) || 'GUEST-DEMO'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
