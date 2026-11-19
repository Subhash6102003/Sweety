import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { InternationalPhoneInput } from '../components/InternationalPhoneInput';
import { getApiUrl } from '../api/client';
import {
  User,
  Shield,
  Stethoscope,
  Heart,
  Activity,
  AlertTriangle,
  Camera,
  Upload,
  Edit3,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Smartphone,
  Layers,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const careTeamKey = `sweety_care_team_${user?.id || 'guest'}`;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  // Care Team state persisted in localStorage
  const [careTeam, setCareTeam] = useState(() => {
    try {
      const saved = localStorage.getItem(careTeamKey);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  const [providerForm, setProviderForm] = useState({
    name: '',
    role: 'Cardiologist',
    facility: '',
    phone: '',
    email: '',
    accessLevel: 'Real-time EHR sync & urgent AGP alerts'
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    relation: 'Spouse',
    phone: '',
    protocol: 'Automatic SMS dispatch if <54 mg/dL hypo is unacknowledged'
  });

  // Handlers for Care Team
  const handleAddProvider = (e) => {
    e.preventDefault();
    if (!providerForm.name.trim()) return;

    const newProvider = {
      id: Date.now(),
      type: 'provider',
      name: providerForm.name.trim(),
      role: providerForm.role,
      facility: providerForm.facility.trim() || 'Clinical Practice',
      phone: providerForm.phone.trim() || '+1 (555) 019-2831',
      email: providerForm.email.trim() || 'clinical@careteam.org',
      accessLevel: providerForm.accessLevel,
      color: providerForm.role.toLowerCase().includes('cardio') ? 'text-rose-600 bg-rose-50' : 'text-primary bg-primary/10'
    };

    const updated = [...careTeam, newProvider];
    setCareTeam(updated);
    try {
      localStorage.setItem(careTeamKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save care team:', err);
    }

    setToastMessage(`Authorized ${newProvider.name} (${newProvider.role})`);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
    setProviderForm({
      name: '',
      role: 'Cardiologist',
      facility: '',
      phone: '',
      email: '',
      accessLevel: 'Real-time EHR sync & urgent AGP alerts'
    });
    setProviderModalOpen(false);
  };

  const handleAddEmergencyContact = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim()) return;

    const newContact = {
      id: Date.now(),
      type: 'emergency',
      name: contactForm.name.trim(),
      role: `Emergency Contact (${contactForm.relation})`,
      relation: contactForm.relation,
      facility: 'Family Proxy',
      phone: contactForm.phone.trim() || '+1 (555) 302-9912',
      email: '',
      accessLevel: contactForm.protocol,
      color: 'text-amber-800 bg-amber-50'
    };

    const updated = [...careTeam, newContact];
    setCareTeam(updated);
    try {
      localStorage.setItem(careTeamKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save emergency contact:', err);
    }

    setToastMessage(`Added emergency proxy: ${newContact.name}`);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
    setContactForm({
      name: '',
      relation: 'Spouse',
      phone: '',
      protocol: 'Automatic SMS dispatch if <54 mg/dL hypo is unacknowledged'
    });
    setContactModalOpen(false);
  };

  const handleDeleteCareMember = (id) => {
    const updated = careTeam.filter(m => m.id !== id);
    setCareTeam(updated);
    try {
      localStorage.setItem(careTeamKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to update care team:', err);
    }
  };

  // Editable Profile States
  const [formData, setFormData] = useState({
    name: user?.name || (isDemo ? 'Elena Vance' : 'Patient'),
    email: user?.email || (isDemo ? 'elena.vance@sweetycare.io' : ''),
    phone: user?.phone || (isDemo ? '+1 (415) 890-2100' : ''),
    location: user?.location || (isDemo ? 'Palo Alto, California' : ''),
    age: user?.age || (isDemo ? '32' : '--'),
    gender: user?.gender || (isDemo ? 'Female' : 'Not specified'),
    height: user?.height || (isDemo ? "5'7\" (170 cm)" : '--'),
    weight: user?.weight || (isDemo ? '138 lbs (62.6 kg)' : '--'),
    diagnosis: user?.diagnosis || (isDemo ? 'Type 1 Diabetes (2018)' : 'Type 1 Diabetes'),
    mrn: user?.mrn || (isDemo ? 'MRN: 941208-T1' : `MRN: ${Math.floor(100000 + Math.random() * 900000)}-T1`),
    avatarUrl: user?.avatarUrl || (isDemo ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Patient')}&background=ad2737&color=fff`),
    basalUnits: user?.basalUnits || (isDemo ? '18.5 U/day' : 'Not configured'),
    icrRatio: user?.icrRatio || (isDemo ? '1:10 g' : '1:10 g'),
    isfFactor: user?.isfFactor || (isDemo ? '1:45 mg/dL' : '1:45 mg/dL'),
    diaDuration: user?.diaDuration || (isDemo ? '3.5 Hours' : '4.0 Hours')
  });

  // Handle local avatar photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    let toSave = { ...formData };
    if (toSave.avatarUrl && toSave.avatarUrl.startsWith('data:image')) {
      try {
        const token = localStorage.getItem('sweety_token');
        const uploadRes = await fetch(getApiUrl('/api/upload/avatar'), {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ image: toSave.avatarUrl })
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.publicUrl) {
          toSave.avatarUrl = uploadData.publicUrl;
        }
      } catch (uploadErr) {
        console.warn('Avatar upload fallback to preview:', uploadErr);
      }
    }
    setFormData(toSave);
    updateUser(toSave);
    setEditModalOpen(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16 font-sans text-on-surface">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              CLINICAL PATIENT RECORD &bull; AMBULATORY REGISTRY
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            My Health Profile
          </h1>
          <p className="text-xs text-on-surface-variant">
            Demographic records, clinical glycemic targets, insulin sensitivity ratios, and provider permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditModalOpen(true)}
          className="self-start sm:self-auto h-9 px-4 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile &amp; Photo</span>
        </button>
      </div>

      {/* Toast Notification */}
      {savedToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage || 'Health profile & clinical parameters updated successfully!'}</span>
        </div>
      )}

      {/* TOP DEMOGRAPHIC HERO CARD (Matching Image 4) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with Camera badge */}
            <div className="relative group shrink-0">
              <img
                src={formData.avatarUrl}
                alt={formData.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30 shadow-md ring-4 ring-primary/10"
              />
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                title="Change Photo"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-2xl font-extrabold text-on-surface">
                  {formData.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {formData.diagnosis}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-outline text-[11px] font-semibold">
                  {formData.mrn}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> {formData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-secondary" /> {formData.phone}
                </span>
                {formData.location ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-tertiary" /> {formData.location}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              Primary Care Clinic
            </span>
            <span className="font-bold text-xs text-on-surface">
              {isDemo ? 'Stanford Endocrine Center' : 'Self-Monitored'}
            </span>
            <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-tertiary animate-pulse' : 'bg-outline'}`} />
              {isDemo ? 'Direct Telemetry Sync Active' : 'Independent Telemetry'}
            </span>
          </div>
        </div>

        {/* Demographic Quick Pills Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-outline-variant/20">
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] uppercase font-bold text-outline block">Age</span>
            <span className="text-sm font-bold text-on-surface">{formData.age} Yrs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] uppercase font-bold text-outline block">Sex</span>
            <span className="text-sm font-bold text-on-surface">{formData.gender}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] uppercase font-bold text-outline block">Height</span>
            <span className="text-sm font-bold text-on-surface">{formData.height}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] uppercase font-bold text-outline block">Weight</span>
            <span className="text-sm font-bold text-on-surface">{formData.weight}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] uppercase font-bold text-outline block">BMI Metric</span>
            <span className="text-sm font-bold text-tertiary">21.6 (Normal)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] uppercase font-bold text-outline block">Lab HbA1c</span>
            <span className="text-sm font-bold text-primary">5.9% (Optimal)</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: TARGET GLYCEMIC RANGES (Continuous Band + 3 Targets + 3 Alerts) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
          <div>
            <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Target Glycemic Ranges &amp; Sensor Calibration</span>
            </h3>
            <p className="text-xs text-outline">
              Standard clinical 5-band corridor calibrated in accordance with ADA / ATTD International Consensus.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ADA 70&ndash;140 Standard Active
          </span>
        </div>

        {/* Continuous Color-Coded Continuum Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-outline">
            <span>Severe Hypo (&lt;54)</span>
            <span>Target Corridor (70&ndash;140 mg/dL)</span>
            <span>Severe Hyper (&gt;180)</span>
          </div>

          <div className="h-5 w-full rounded-full overflow-hidden flex shadow-inner border border-outline-variant/40">
            {/* Very Low */}
            <div
              className="bg-rose-700 h-full flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ width: '8%' }}
              title="< 54 mg/dL Very Low (<1%)"
            >
              &lt;54
            </div>
            {/* Low */}
            <div
              className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ width: '12%' }}
              title="54-69 mg/dL Low (<4%)"
            >
              54-69
            </div>
            {/* In Range (Optimal) */}
            <div
              className="bg-emerald-500 h-full flex items-center justify-center text-[11px] font-extrabold text-white shadow-xs"
              style={{ width: '56%' }}
              title="70-140 mg/dL In Range (Optimal >70%)"
            >
              70 &ndash; 140 mg/dL (Optimal 88% Achieved)
            </div>
            {/* Elevated */}
            <div
              className="bg-rose-400 h-full flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ width: '14%' }}
              title="141-180 mg/dL Elevated (<25%)"
            >
              141-180
            </div>
            {/* Very High */}
            <div
              className="bg-rose-800 h-full flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ width: '10%' }}
              title="> 180 mg/dL High (<5%)"
            >
              &gt;180
            </div>
          </div>
        </div>

        {/* 3 Prescribed Targets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Fasting Waking Target
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-on-surface tabular-nums">70 &ndash; 100</span>
              <span className="text-xs text-outline font-semibold">mg/dL</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">Baseline waking capillary and sensor window.</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Post-Meal (2h) Target
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-on-surface tabular-nums">&lt; 140</span>
              <span className="text-xs text-outline font-semibold">mg/dL</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">Postprandial peak mitigation limit.</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
              Bedtime Safety Target
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-on-surface tabular-nums">100 &ndash; 130</span>
              <span className="text-xs text-outline font-semibold">mg/dL</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">Pre-sleep safety buffer to prevent nocturnal hypos.</p>
          </div>
        </div>

        {/* 3 Critical Alert Thresholds */}
        <div className="space-y-2 pt-2 border-t border-outline-variant/20">
          <span className="text-xs font-bold text-on-surface block">Critical Alarm &amp; Emergency Thresholds</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold block">Urgent Low Alarm: &lt; 54 mg/dL</strong>
                <span className="text-[11px] text-rose-700">Immediate continuous audible siren override even on Silent mode.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold block">Urgent High Alarm: &gt; 220 mg/dL</strong>
                <span className="text-[11px] text-amber-700">Triggers prompt if sustained above threshold for &gt;45 min.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 flex items-start gap-3">
              <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold block">Rapid Fall Rate: &gt; 2.5 mg/dL/min</strong>
                <span className="text-[11px] text-blue-700">Predictive Hypo Shield alerts 20 minutes before prospective low.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INSULIN THERAPY & SENSITIVITY PARAMETERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Insulin Ratios */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <h3 className="font-display text-base font-bold text-on-surface">
                Insulin Regimen &amp; Titration Ratios
              </h3>
            </div>
            <span className="text-[10px] font-bold text-outline">MDI / InPen Profile</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div>
                <strong className="text-on-surface block">Basal Rate (Long-Acting)</strong>
                <span className="text-[11px] text-outline">Insulin Degludec (Tresiba) &bull; Once daily 10:00 PM</span>
              </div>
              <span className="font-display font-extrabold text-sm text-primary">{formData.basalUnits}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div>
                <strong className="text-on-surface block">Insulin-to-Carbohydrate Ratio (ICR)</strong>
                <span className="text-[11px] text-outline">Breakfast: 1:8g &bull; Lunch: 1:10g &bull; Dinner: 1:12g</span>
              </div>
              <span className="font-display font-extrabold text-sm text-on-surface">{formData.icrRatio}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div>
                <strong className="text-on-surface block">Insulin Sensitivity Factor (ISF)</strong>
                <span className="text-[11px] text-outline">1 Unit rapid-acting drops blood glucose by 45 mg/dL</span>
              </div>
              <span className="font-display font-extrabold text-sm text-on-surface">{formData.isfFactor}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div>
                <strong className="text-on-surface block">Duration of Insulin Action (DIA)</strong>
                <span className="text-[11px] text-outline">Active Insulin (IOB) decay curve calculation window</span>
              </div>
              <span className="font-display font-extrabold text-sm text-on-surface">{formData.diaDuration}</span>
            </div>
          </div>
        </div>

        {/* Right: Hardware & Telemetry Devices */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <h3 className="font-display text-base font-bold text-on-surface">
                Hardware &amp; Telemetry Devices
              </h3>
            </div>
            <span className="text-xs font-bold text-tertiary flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-tertiary animate-pulse' : 'bg-outline'}`} />
              {isDemo ? '3 Devices Synced' : '0 Devices Synced'}
            </span>
          </div>

          {isDemo ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-on-surface block">Dexcom G7 CGM System</span>
                  <span className="text-[11px] text-outline block">Transmitter ID: #DX-9942 &bull; Slot: Left Tricep</span>
                  <span className="text-[11px] text-tertiary font-bold">10 Days remaining &bull; 98.2% Active Wear</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  STREAMING
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-on-surface block">Contour Next Gen Meter (BGM)</span>
                  <span className="text-[11px] text-outline block">Bluetooth Capillary Cross-Verification Meter</span>
                  <span className="text-[11px] text-outline">Last calibrated: Yesterday 07:15 AM</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-outline text-[10px] font-bold">
                  STANDBY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-on-surface block">InPen Smart Insulin Injector</span>
                  <span className="text-[11px] text-outline block">Firmware 3.2.1 &bull; Auto-dose telemetry synced</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  PAIRED
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center space-y-3">
              <Smartphone className="w-8 h-8 text-outline mx-auto" />
              <div>
                <strong className="text-xs font-bold text-on-surface block">No Continuous Telemetry Hardware Paired</strong>
                <p className="text-[11px] text-outline max-w-xs mx-auto mt-0.5">
                  Connect your Dexcom G6/G7, FreeStyle Libre 2/3, or Bluetooth BGM meter to stream real-time glucose readings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('Device pairing wizard: Select Dexcom, Abbott Libre, or Medtronic Guardian.')}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer"
              >
                + Pair CGM Device
              </button>
            </div>
          )}
        </div>

      </div>

      {/* SECTION 3: CARE TEAM NETWORK & EMERGENCY CONTACTS */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <h3 className="font-display text-base font-bold text-on-surface">
              Care Team Network &amp; Clinical Authorizations
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setProviderModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Authorize Provider / Cardiologist</span>
            </button>
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-on-surface text-xs font-bold hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Emergency Contact</span>
            </button>
          </div>
        </div>

        {isDemo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  AT
                </div>
                <div>
                  <strong className="text-xs font-bold text-on-surface block">Dr. Aris Thorne, MD</strong>
                  <span className="text-[11px] text-outline block">Endocrinologist &bull; St. Jude Clinic</span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant">Real-time EHR sync authorized. Receives quarterly AGP dossiers.</p>
              <span className="text-[11px] font-semibold text-primary block">(415) 890-3321</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
                  SJ
                </div>
                <div>
                  <strong className="text-xs font-bold text-on-surface block">Sarah Jenkins, CDCES</strong>
                  <span className="text-[11px] text-outline block">Certified Diabetes Educator</span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant">Nutrition and exercise bolus titration advisor.</p>
              <span className="text-[11px] font-semibold text-secondary block">(415) 890-3344</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                  MV
                </div>
                <div>
                  <strong className="text-xs font-bold text-on-surface block">Marcus Vance</strong>
                  <span className="text-[11px] text-outline block">Primary Emergency Contact (Spouse)</span>
                </div>
              </div>
              <p className="text-[11px] text-rose-700 font-medium">Automatic SMS dispatch if &lt;54 mg/dL hypo is unacknowledged.</p>
              <span className="text-[11px] font-bold text-on-surface block">(415) 890-4491</span>
            </div>
          </div>
        ) : careTeam.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careTeam.map((member) => {
              const initials = member.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR';
              return (
                <div key={member.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.color || 'bg-primary/10 text-primary'}`}>
                          {initials}
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-on-surface block">{member.name}</strong>
                          <span className="text-[11px] text-outline block">{member.role} &bull; {member.facility}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCareMember(member.id)}
                        title="Remove Member"
                        className="p-1 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">{member.accessLevel}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[11px]">
                    <span className="font-semibold text-primary">{member.phone}</span>
                    {member.email && <span className="text-outline truncate max-w-[120px]">{member.email}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center space-y-3">
            <Stethoscope className="w-8 h-8 text-outline mx-auto" />
            <div>
              <strong className="text-xs font-bold text-on-surface block">No External Care Team or Proxies Linked</strong>
              <p className="text-[11px] text-outline max-w-sm mx-auto mt-0.5">
                Authorize your cardiologist, endocrinologist, or family emergency proxy to receive automated AGP dossiers and urgent alerts.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setProviderModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer"
              >
                + Authorize Provider / Cardiologist
              </button>
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/60 text-on-surface text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
              >
                Add Emergency Contact
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-surface-container-lowest">
              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">Edit Health Profile &amp; Photo</h3>
                <p className="text-xs text-outline">Update your personal medical demographics and avatar.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-5 overflow-y-auto">
              
              {/* Photo Upload Row */}
              <div className="flex items-center gap-5 p-4 bg-surface-container-low rounded-2xl">
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary shrink-0"
                />
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-on-surface block">Profile Photo</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Phone Number with International Country Flag & Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">Phone Number</label>
                  <span className="text-[10px] text-outline font-semibold">Worldwide Flags &amp; Codes</span>
                </div>
                <InternationalPhoneInput
                  value={formData.phone}
                  onChange={(fullNumber) => setFormData(p => ({ ...p, phone: fullNumber }))}
                />
              </div>

              {/* Optional Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Location / City (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. London, UK or Mumbai, India"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-medium placeholder:text-outline"
                />
              </div>

              {/* Age, Height, Weight with Dual US / UK Standards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(p => ({ ...p, age: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Height (ft / in or cm)</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData(p => ({ ...p, height: e.target.value }))}
                    placeholder="e.g. 5'7 in or 170 cm"
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Weight (lbs or kg)</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData(p => ({ ...p, weight: e.target.value }))}
                    placeholder="e.g. 138 lbs or 62.5 kg"
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Primary Diagnosis</label>
                <select
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(p => ({ ...p, diagnosis: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold"
                >
                  <option value="Type 1 Diabetes (2018)">Type 1 Diabetes (2018)</option>
                  <option value="Type 2 Diabetes (Adult Onset)">Type 2 Diabetes (Adult Onset)</option>
                  <option value="Gestational Diabetes">Gestational Diabetes</option>
                  <option value="LADA (Latent Autoimmune Diabetes)">LADA (Latent Autoimmune Diabetes)</option>
                </select>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-outline hover:text-on-surface hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* AUTHORIZE PROVIDER / CARDIOLOGIST MODAL */}
      {providerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">Authorize Care Provider / Cardiologist</h3>
                  <p className="text-xs text-outline">Authorize physician telemetry sync &amp; AGP report dispatches</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProviderModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProvider} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Provider Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Miller, MD"
                  value={providerForm.name}
                  onChange={(e) => setProviderForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold placeholder:text-outline"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Clinical Specialty</label>
                  <select
                    value={providerForm.role}
                    onChange={(e) => setProviderForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold"
                  >
                    <option value="Cardiologist">Cardiologist (Cardiovascular)</option>
                    <option value="Endocrinologist">Endocrinologist (Diabetic Specialist)</option>
                    <option value="Primary Care Physician">Primary Care Physician (PCP)</option>
                    <option value="Diabetes Educator (CDCES)">Diabetes Educator (CDCES)</option>
                    <option value="Nephrologist">Nephrologist (Renal Care)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Clinic / Hospital</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Heart &amp; Vascular"
                    value={providerForm.facility}
                    onChange={(e) => setProviderForm(p => ({ ...p, facility: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs placeholder:text-outline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. (415) 890-3321"
                    value={providerForm.phone}
                    onChange={(e) => setProviderForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs placeholder:text-outline"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Clinical Email (Dossiers)</label>
                  <input
                    type="email"
                    placeholder="e.g. dr.miller@metrohealth.org"
                    value={providerForm.email}
                    onChange={(e) => setProviderForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs placeholder:text-outline"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Authorization &amp; Sync Protocol</label>
                <select
                  value={providerForm.accessLevel}
                  onChange={(e) => setProviderForm(p => ({ ...p, accessLevel: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold"
                >
                  <option value="Real-time EHR sync & urgent AGP alerts">Real-time EHR sync &amp; urgent AGP alerts</option>
                  <option value="Quarterly AGP report dispatches only">Quarterly AGP report dispatches only</option>
                  <option value="Critical severe hypoglycemia emergency escalation">Critical severe hypoglycemia emergency escalation</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProviderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-outline hover:text-on-surface hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
                >
                  Authorize Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EMERGENCY CONTACT MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">Add Emergency Contact &amp; Proxy</h3>
                  <p className="text-xs text-outline">Nominate a proxy for emergency hypoglycemia notifications</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmergencyContact} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Contact Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Vance"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold placeholder:text-outline"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Relationship</label>
                  <select
                    value={contactForm.relation}
                    onChange={(e) => setContactForm(p => ({ ...p, relation: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs font-semibold"
                  >
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Adult Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Legal Guardian</option>
                    <option value="Trusted Friend">Trusted Friend</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Emergency Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (415) 890-4491"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs placeholder:text-outline"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Safety Dispatch Protocol</label>
                <input
                  type="text"
                  value={contactForm.protocol}
                  onChange={(e) => setContactForm(p => ({ ...p, protocol: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-outline hover:text-on-surface hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container transition-all cursor-pointer"
                >
                  Save Emergency Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
