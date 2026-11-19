import React, { useState } from 'react';
import { Pill, Syringe, Clock, CheckCircle2, AlertCircle, Plus, Activity, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_MEDICATIONS = [
  {
    id: 1,
    name: 'Tresiba (Insulin Degludec)',
    type: 'Long-Acting Basal Insulin',
    dose: '18 Units',
    frequency: 'Once Daily at Bedtime (10:00 PM)',
    lastTaken: 'Yesterday, 10:00 PM',
    status: 'On Schedule'
  },
  {
    id: 2,
    name: 'Novolog (Insulin Aspart)',
    type: 'Rapid-Acting Bolus Insulin',
    dose: 'Mealtime ICR 1:10g',
    frequency: 'Before Meals (15 min prior)',
    lastTaken: 'Today, 01:20 PM',
    status: 'Active Regimen'
  }
];

export const MedicationPage = () => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const storageKey = `sweety_medications_${user?.id || 'guest'}`;

  const [medications, setMedications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      return isDemo ? DEFAULT_MEDICATIONS : [];
    } catch {
      return isDemo ? DEFAULT_MEDICATIONS : [];
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Rapid-Acting Bolus Insulin');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('Before Meals');
  const [toast, setToast] = useState('');

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!name.trim() || !dose.trim()) return;

    const newMed = {
      id: Date.now(),
      name: name.trim(),
      type,
      dose: dose.trim(),
      frequency,
      lastTaken: 'Just added',
      status: 'Active Regimen'
    };

    const updated = [newMed, ...medications];
    setMedications(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save medications:', err);
    }

    setToast(`Added "${name}" to active prescriptions`);
    setTimeout(() => setToast(''), 3000);
    setName('');
    setDose('');
    setModalOpen(false);
  };

  const handleDeleteMedication = (id) => {
    const updated = medications.filter(m => m.id !== id);
    setMedications(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete medication:', err);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 font-sans text-on-surface">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              PHARMACOTHERAPY &bull; CLINICAL DOSING
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Medication &amp; Insulin Protocols
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl">
            Basal and bolus insulin regimens, oral antidiabetic agents, and dosage administration schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-sm hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Prescription</span>
        </button>
      </div>

      {/* Regimen Cards List */}
      {medications.length > 0 ? (
        <div className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  {med.type.includes('Insulin') ? <Syringe className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold text-on-surface">{med.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold text-[10px]">
                      {med.type}
                    </span>
                  </div>
                  <p className="text-xs text-outline font-medium">{med.dose} &bull; {med.frequency}</p>
                  <p className="text-[11px] text-tertiary font-semibold flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last Taken: {med.lastTaken}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {med.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteMedication(med.id)}
                  title="Remove Prescription"
                  className="p-1.5 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/60 text-center space-y-3">
          <Pill className="w-10 h-10 text-outline mx-auto" />
          <div>
            <strong className="text-sm font-bold text-on-surface block">No Prescriptions Recorded</strong>
            <p className="text-xs text-outline max-w-sm mx-auto mt-1">
              Add your current insulin regimens, Metformin, or oral medications to track your dosing protocols.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-xs hover:bg-primary-container transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Prescription</span>
          </button>
        </div>
      )}

      {/* ADD PRESCRIPTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-surface-container-lowest">
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">Add Medication / Prescription</h3>
                <p className="text-xs text-outline">Configure a new clinical insulin regimen or oral antidiabetic drug.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleAddMedication} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Medication / Drug Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tresiba (Insulin Degludec) or Metformin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Therapy Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Rapid-Acting Bolus Insulin">Rapid-Acting Bolus Insulin (Humalog / Novolog)</option>
                  <option value="Long-Acting Basal Insulin">Long-Acting Basal Insulin (Lantus / Tresiba)</option>
                  <option value="Oral Antidiabetic Agent">Oral Antidiabetic Agent (Metformin / SGLT2)</option>
                  <option value="Hypoglycemia Emergency Rescue">Emergency Rescue (Baqsimi / Glucagon)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Dosage / Units *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18 Units or 500 mg"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Administration Timing</label>
                  <input
                    type="text"
                    placeholder="e.g. Bedtime 10 PM or Before Meals"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-bold text-outline hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer"
                >
                  Save Prescription
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
