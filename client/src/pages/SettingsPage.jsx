import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Shield,
  Lock,
  Smartphone,
  Database,
  Check,
  Download,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Laptop,
  Flame,
  User,
  Sliders,
  FileText,
  Key
} from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [glucoseUnit, setGlucoseUnit] = useState('mgdl');
  const [carbMode, setCarbMode] = useState('grams');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [hba1cStandard, setHba1cStandard] = useState('percentage');
  const [presetRange, setPresetRange] = useState('ada');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [endoAuditAccess, setEndoAuditAccess] = useState(true);
  const [claritySync, setClaritySync] = useState(true);
  const [researchSharing, setResearchSharing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e?.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navTabs = [
    { id: 'all', label: 'All Settings' },
    { id: 'account', label: 'Account & Security' },
    { id: 'health', label: 'Health & Units' },
    { id: 'privacy', label: 'Data & Privacy' },
    { id: 'export', label: 'Export & Archives' },
  ];

  return (
    <div className="flex flex-col w-full space-y-6 pb-20 font-sans text-on-surface">
      
      {/* Top Banner / System Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              SYSTEM &bull; PATIENT CONFIGURATION
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Sweety Rose &ndash; Settings
          </h1>
          <p className="text-xs text-on-surface-variant">
            Account security, medical data privacy, measurement units, integration preferences, and export archives.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>HIPAA &amp; GDPR Validated</span>
          </span>

          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-4 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Nav Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CARD 1: ACCOUNT & SECURITY */}
      {(activeTab === 'all' || activeTab === 'account') && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
            <div>
              <h2 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>Account &amp; Security</span>
              </h2>
              <p className="text-xs text-outline">
                Profile credentials, biometric verification, and device telemetry access.
              </p>
            </div>
            <span className="text-[11px] font-bold text-primary">
              Tier: Continuous Medical Pro
            </span>
          </div>

          {/* Profile Summary Card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-on-surface">{user?.name || 'Elena Vance'}</strong>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-outline text-[10px] font-bold">
                    Primary Patient Profile
                  </span>
                </div>
                <p className="text-xs text-outline">{user?.email || 'elena.vance@sweetycare.io'}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-on-surface-variant mt-1">
                  <span>Diagnostic Context: <strong>{user?.diagnosis || 'Type 1 Diabetes (2018)'}</strong></span>
                  <span>&bull;</span>
                  <span>Clinical Record ID: <strong>{user?.mrn || 'MRN: 941208-T1'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column: 2FA & Biometrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Two-Factor Auth */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-on-surface">Two-Factor Authentication</strong>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Configured
                  </span>
                </div>
                <p className="text-[11px] text-outline mt-1">
                  Authenticator App (TOTP RFC 6238) protects your glycemic telemetry from unauthorized exports.
                </p>
                <span className="inline-block mt-2 text-[11px] text-emerald-700 font-bold">
                  &bull; Active &amp; Shielded (Google Authenticator)
                </span>
              </div>
              <button
                type="button"
                onClick={() => alert('TOTP Authenticator Reconfiguration Dialog')}
                className="self-start px-3 py-1.5 rounded-lg border border-outline-variant/50 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                Reconfigure
              </button>
            </div>

            {/* Biometric Login */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <strong className="text-xs font-bold text-on-surface">Biometric Login</strong>
                  <p className="text-[11px] text-outline mt-1">
                    Quick unlock using FaceID / TouchID on locked mobile &amp; web sessions.
                  </p>
                  <span className="inline-block mt-2 text-[11px] text-outline font-semibold">
                    Enabled (2 Devices)
                  </span>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                    biometricEnabled ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Telemetry Sessions - Demo Only */}
          {user?.email === 'demo@sweety.app' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-on-surface block">Active Telemetry Sessions (Demo Sandbox)</span>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-4 h-4 text-primary" />
                    <div>
                      <strong className="text-on-surface">Chrome on macOS</strong>
                      <span className="text-outline block text-[11px]">Palo Alto, USA &bull; Current Active Session</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    This PC
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-secondary" />
                    <div>
                      <strong className="text-on-surface">Sweety iOS Companion</strong>
                      <span className="text-outline block text-[11px]">iPhone 15 Pro &bull; Synced 4m ago</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Session revoked')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CARD 2: HEALTH MEASUREMENT UNITS & STANDARDS (Matching Image 2) */}
      {(activeTab === 'all' || activeTab === 'health') && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
            <div>
              <h2 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Health Measurement Units &amp; Standards</span>
              </h2>
              <p className="text-xs text-outline">
                Configure clinical telemetry metrics, glycemic targets, and carb calculation models.
              </p>
            </div>
          </div>

          {/* 4 Unit Selectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Glucose Concentration Unit */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <span className="text-xs font-bold text-on-surface block">Glucose Concentration Unit</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGlucoseUnit('mgdl')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    glucoseUnit === 'mgdl'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">mg/dL</strong>
                  <span className="text-[10px] text-outline">Standard US / ADA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGlucoseUnit('mmol')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    glucoseUnit === 'mmol'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">mmol/L</strong>
                  <span className="text-[10px] text-outline">International / UK</span>
                </button>
              </div>
            </div>

            {/* Carbohydrate Counting Mode */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <span className="text-xs font-bold text-on-surface block">Carbohydrate Counting Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCarbMode('grams')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    carbMode === 'grams'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">Total Grams</strong>
                  <span className="text-[10px] text-outline">Standard 1g increments</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCarbMode('portions')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    carbMode === 'portions'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">Carb Portions</strong>
                  <span className="text-[10px] text-outline">10g / 15g Exchanges</span>
                </button>
              </div>
            </div>

            {/* Body Weight Unit */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <span className="text-xs font-bold text-on-surface block">Body Weight Unit</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWeightUnit('lbs')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    weightUnit === 'lbs'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">Pounds (lbs)</strong>
                  <span className="text-[10px] text-outline">Imperial System</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit('kg')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    weightUnit === 'kg'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">Kilograms (kg)</strong>
                  <span className="text-[10px] text-outline">Metric System</span>
                </button>
              </div>
            </div>

            {/* HbA1c Reporting Standard */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <span className="text-xs font-bold text-on-surface block">HbA1c Reporting Standard</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHba1cStandard('percentage')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hba1cStandard === 'percentage'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">% Percentage</strong>
                  <span className="text-[10px] text-outline">NGSP / ADAG Standard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHba1cStandard('mmol')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hba1cStandard === 'mmol'
                      ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                      : 'bg-white border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <strong className="text-xs font-bold text-on-surface block">mmol/mol</strong>
                  <span className="text-[10px] text-outline">IFCC Scientific Standard</span>
                </button>
              </div>
            </div>
          </div>

          {/* Glycemic Target Range Presets (4 Cards) */}
          <div className="space-y-3 pt-2 border-t border-outline-variant/20">
            <span className="text-xs font-bold text-on-surface block">Glycemic Target Range Presets</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Preset 1: ADA Range */}
              <div
                onClick={() => setPresetRange('ada')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  presetRange === 'ada'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-on-surface">ADA Range</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    presetRange === 'ada' ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                  }`}>
                    {presetRange === 'ada' ? 'Active' : 'Option'}
                  </span>
                </div>
                <div className="text-lg font-extrabold text-primary font-display mb-1">70 &ndash; 140 mg/dL</div>
                <p className="text-[11px] text-outline">Recommended standard for non-pregnant adults with T1D.</p>
              </div>

              {/* Preset 2: Pregnancy Tight */}
              <div
                onClick={() => setPresetRange('pregnancy')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  presetRange === 'pregnancy'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-on-surface">Pregnancy Tight</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    presetRange === 'pregnancy' ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                  }`}>
                    {presetRange === 'pregnancy' ? 'Active' : 'Option'}
                  </span>
                </div>
                <div className="text-lg font-extrabold text-secondary font-display mb-1">63 &ndash; 140 mg/dL</div>
                <p className="text-[11px] text-outline">High-precision threshold for gestational regulation.</p>
              </div>

              {/* Preset 3: Senior / Relaxed */}
              <div
                onClick={() => setPresetRange('senior')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  presetRange === 'senior'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-on-surface">Senior / Relaxed</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    presetRange === 'senior' ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                  }`}>
                    {presetRange === 'senior' ? 'Active' : 'Option'}
                  </span>
                </div>
                <div className="text-lg font-extrabold text-tertiary font-display mb-1">80 &ndash; 180 mg/dL</div>
                <p className="text-[11px] text-outline">Minimizes hypoglycemia episodes and alarm fatigue.</p>
              </div>

              {/* Preset 4: Custom Range */}
              <div
                onClick={() => setPresetRange('custom')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  presetRange === 'custom'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-on-surface">Custom Range</span>
                  <span className="text-[10px] font-bold text-outline">Set Limits</span>
                </div>
                <div className="text-lg font-extrabold text-on-surface font-display mb-1">Set Bounds</div>
                <p className="text-[11px] text-outline">Defined by endocrinologist specific to titration plan.</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CARD 3: DATA PRIVACY & CLINICAL SHARING */}
      {(activeTab === 'all' || activeTab === 'privacy') && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
            <div>
              <h2 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Data Privacy &amp; Clinical Sharing</span>
              </h2>
              <p className="text-xs text-outline">
                Manage medical disclosure permissions, physician access tokens, and cloud encryption.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              HIPAA Certified
            </span>
          </div>

          <div className="space-y-4">
            {/* Cryptographic Storage Banner */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
              <strong className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>HIPAA Compliance &amp; Cryptographic Storage</span>
              </strong>
              <p className="text-[11px] text-outline">
                Telemetry records are encrypted using AES-256-GCM in transit and at rest in certified pharma-medical VPCs.
              </p>
            </div>

            {/* Toggle 1: Endocrinologist Audit Access */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs font-bold text-on-surface">Endocrinologist Audit Access</strong>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Grant
                  </span>
                </div>
                <p className="text-[11px] text-outline mt-0.5">
                  Alice H. Robert Miller (Stanford Endocrine Clinic) has real-time audit access to continuous glucose readings and insulin telemetry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEndoAuditAccess(!endoAuditAccess)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ml-4 cursor-pointer ${
                  endoAuditAccess ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  endoAuditAccess ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Toggle 2: Telemetry Cloud Sync */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs font-bold text-on-surface">Telemetry Cloud Sync (Dexcom Clarity API)</strong>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Real-time Stream
                  </span>
                </div>
                <p className="text-[11px] text-outline mt-0.5">
                  Exchanges automated background polling every 5 minutes from Dexcom G7 receiver cloud pipeline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setClaritySync(!claritySync)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ml-4 cursor-pointer ${
                  claritySync ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  claritySync ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Toggle 3: Anonymous Research Contribution */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold text-on-surface block">Anonymous Research Contribution</strong>
                <p className="text-[11px] text-outline mt-0.5">
                  Share de-identified glycemic trends and carb absorption curves with the Diabetes Care Research Initiative to advance T1D modeling.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResearchSharing(!researchSharing)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ml-4 cursor-pointer ${
                  researchSharing ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  researchSharing ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD 4: DATA EXPORT, BACKUP & ACCOUNT MANAGEMENT */}
      {(activeTab === 'all' || activeTab === 'export') && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
            <div>
              <h2 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span>Data Export, Backup &amp; Account Management</span>
              </h2>
              <p className="text-xs text-outline">
                Download compliant clinical archives, transfer storage volumes, or manage data lifecycle.
              </p>
            </div>
          </div>

          {/* 3 Export Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Full History</span>
                <strong className="text-xs font-bold text-on-surface block mt-1">Complete History (.CSV)</strong>
                <p className="text-[11px] text-outline mt-1">
                  Full tabular dataset of glucose records, meal carbs, exercise logs, and basal dosages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('Initiating CSV export...')}
                className="w-full py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-xs font-bold text-on-surface hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Clinical Grade</span>
                <strong className="text-xs font-bold text-on-surface block mt-1">90-Day Clinical Summary (.PDF)</strong>
                <p className="text-[11px] text-outline mt-1">
                  AGP format with mean-day plots, TIR breakdowns, and glycemic variability indices for provider consultation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('Generating 90-Day Clinical Summary PDF...')}
                className="w-full py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Raw Telemetry</span>
                <strong className="text-xs font-bold text-on-surface block mt-1">Sensor Raw Stream (.JSON)</strong>
                <p className="text-[11px] text-outline mt-1">
                  Audited 5-minute Dexcom CGM payloads with timestamps, trend vectors, and calibration records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('Exporting JSON telemetry archive...')}
                className="w-full py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-xs font-bold text-on-surface hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Automated Cloud Backup info */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-xs font-bold text-on-surface block">Automated Encrypted Cloud Backup</strong>
              <p className="text-[11px] text-outline">Last successful snapshot: Today at 04:00 AM (28.8 MB total payload)</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Creating live snapshot backup...')}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-white text-xs font-bold text-on-surface hover:bg-surface-container transition-all self-start sm:self-auto cursor-pointer"
            >
              Create Snapshot Now
            </button>
          </div>

          {/* Danger Zone */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
            <span className="text-xs font-extrabold text-rose-900 block flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Danger Zone</span>
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <strong className="text-xs font-bold text-rose-900 block">Pause Telemetry Sync</strong>
                <p className="text-[11px] text-rose-700">Temporarily suspends background CGM streaming and doctor notifications.</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Telemetry sync paused.')}
                className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Pause Sync
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-rose-200">
              <div>
                <strong className="text-xs font-bold text-rose-900 block">Deactivate Account &amp; Request Data Deletion</strong>
                <p className="text-[11px] text-rose-700">Permanently removes all clinical logs, historical AGP charts, and physician associations.</p>
              </div>
              <button
                type="button"
                onClick={() => confirm('Are you sure you want to permanently delete your medical profile?') && alert('Deletion scheduled under HIPAA right-to-be-forgotten.')}
                className="px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Deactivate &amp; Purge
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
