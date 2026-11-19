import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { InternationalPhoneInput } from '../components/InternationalPhoneInput';
import { GoogleAuthModal } from '../components/GoogleAuthModal';
import { Camera, Upload, Check, User, Heart, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '../api/client';

export const Register = ({ onNavigate, onSuccess }) => {
  const { register, login } = useAuth();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [diabetesContext, setDiabetesContext] = useState('t1d');
  const [telemetryUnit, setTelemetryUnit] = useState('mgdl');
  const [age, setAge] = useState('32');
  const [phone, setPhone] = useState('+1 (415) 890-2100');
  
  // Measurement Standard Matrix: 'us' (Imperial: lbs, ft/in) vs 'uk' (Metric: kg, cm)
  const [unitMatrix, setUnitMatrix] = useState('us');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [heightCm, setHeightCm] = useState('170');
  const [weightLbs, setWeightLbs] = useState('138');
  const [weightKg, setWeightKg] = useState('62.5');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [termsConsent, setTermsConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Suggested curated avatars if user doesn't upload a local file
  const SAMPLE_AVATARS = [
    {
      id: 'elena',
      label: 'Elena',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'sarah',
      label: 'Sarah',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'marcus',
      label: 'Marcus',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'alex',
      label: 'Alex',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    }
  ];

  // Convert between US and UK measurement matrices
  const handleUnitMatrixSwitch = (newMatrix) => {
    if (newMatrix === unitMatrix) return;
    setUnitMatrix(newMatrix);
    if (newMatrix === 'uk') {
      // US -> UK: convert ft/in to cm, lbs to kg
      const ft = parseFloat(heightFt) || 5;
      const inch = parseFloat(heightIn) || 7;
      const totalCm = Math.round((ft * 12 + inch) * 2.54);
      setHeightCm(totalCm.toString());

      const lbs = parseFloat(weightLbs) || 138;
      const kg = (lbs * 0.453592).toFixed(1);
      setWeightKg(kg);
    } else {
      // UK -> US: convert cm to ft/in, kg to lbs
      const cm = parseFloat(heightCm) || 170;
      const totalInches = Math.round(cm / 2.54);
      const ft = Math.floor(totalInches / 12);
      const inch = totalInches % 12;
      setHeightFt(ft.toString());
      setHeightIn(inch.toString());

      const kg = parseFloat(weightKg) || 62.5;
      const lbs = Math.round(kg * 2.20462);
      setWeightLbs(lbs.toString());
    }
  };

  // Handle local file selection
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // Password strength calculation
  const getPasswordStrength = (val) => {
    if (!val) return { score: 0, text: 'Enter 8+ characters', color: 'text-outline' };
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score === 1) return { score: 1, text: 'Weak', color: 'text-error' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'text-secondary' };
    if (score === 3) return { score: 3, text: 'Good', color: 'text-primary' };
    return { score: 4, text: 'Strong clinical cipher', color: 'text-primary font-bold' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!termsConsent) {
      setError('Please agree to the Terms of Service and HIPAA consent.');
      return;
    }
    setError('');
    setLoading(true);

    const diagnosisLabel =
      diabetesContext === 't1d' ? 'Type 1 Diabetes' :
      diabetesContext === 't2d' ? 'Type 2 Diabetes' :
      diabetesContext === 'prediabetes' ? 'Gestational / Pre-Diabetes' : 'Diabetic Wellness';

    const formattedHeight = unitMatrix === 'us'
      ? `${heightFt}'${heightIn}" (${Math.round((parseInt(heightFt || 5) * 12 + parseInt(heightIn || 7)) * 2.54)} cm)`
      : `${heightCm} cm (${Math.floor(Math.round(parseInt(heightCm || 170) / 2.54) / 12)}'${Math.round(parseInt(heightCm || 170) / 2.54) % 12}")`;

    const formattedWeight = unitMatrix === 'us'
      ? `${weightLbs} lbs (${(parseFloat(weightLbs || 138) * 0.453592).toFixed(1)} kg)`
      : `${weightKg} kg (${Math.round(parseFloat(weightKg || 62.5) * 2.20462)} lbs)`;

    try {
      let finalAvatarUrl = avatarUrl;
      // If user uploaded a local image, upload directly to Supabase Storage bucket 'avatars'
      if (finalAvatarUrl && finalAvatarUrl.startsWith('data:image')) {
        try {
          const uploadRes = await fetch(getApiUrl('/api/upload/avatar'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: finalAvatarUrl })
          });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.publicUrl) {
            finalAvatarUrl = uploadData.publicUrl;
          }
        } catch (uploadErr) {
          console.warn('Avatar upload fallback to preview:', uploadErr);
        }
      }

      await register(email, password, fullName, {
        avatarUrl: finalAvatarUrl || SAMPLE_AVATARS[0].url,
        diabetesContext,
        diagnosis: diagnosisLabel,
        telemetryUnit,
        unitMatrix,
        age,
        phone,
        height: formattedHeight,
        weight: formattedWeight,
        mrn: `MRN: ${Math.floor(100000 + Math.random() * 900000)}-T1`
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed. Try signing in or use demo account.');
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    try {
      await login('demo@sweety.app', 'Password123!');
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Demo sign in failed.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col justify-center items-center py-8 px-4 selection:bg-primary/20">
      
      {/* Top Header Navigation Strip */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between mb-4 z-20">
        <button
          type="button"
          onClick={() => onNavigate?.('landing')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeSelector align="right" />
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* LEFT COLUMN: Brand Experience & Trust Ecosystem (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full w-fit">
                <Heart className="w-3.5 h-3.5 fill-current text-primary" />
                <span className="font-label-sm text-[10px] uppercase tracking-wider font-bold">
                  Clinical Precision
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-on-surface font-extrabold leading-tight">
                Create your <span className="text-primary underline decoration-secondary-container decoration-4 underline-offset-4">clinical</span> profile.
              </h1>
              <p className="font-body-lg text-on-surface-variant text-sm sm:text-base leading-relaxed">
                Join 45,000+ Type 1 and Type 2 diabetics tracking CGM telemetry, calculating insulin sensitivities, and sharing certified AGP reports with endocrinologists.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">HIPAA &amp; GDPR Validated Vault</span>
                  <span className="text-[11px] text-on-surface-variant">AES-256 zero-knowledge client encryption for all telemetry logs.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Sub-Second CGM Streaming</span>
                  <span className="text-[11px] text-on-surface-variant">Live BLE receiver pipeline for Dexcom G6/G7 and Abbott Freestyle Libre 2/3.</span>
                </div>
              </div>
            </div>

            {/* Simulated Live CGM Card */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-on-surface">Dexcom G7 Live Sync</span>
                </div>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                  In Range (94%)
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">112</span>
                <span className="text-xs text-outline font-semibold">mg/dL</span>
                <span className="text-primary text-xs font-bold">↗ +2 mg/dL</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Registration Form with Photo Upload (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xl border border-outline-variant/30">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="font-display text-2xl font-extrabold text-on-surface">
                Patient Registration &amp; Setup
              </h2>
              <p className="text-xs text-on-surface-variant">
                Configure your real credentials, demographics, and profile photo.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Google Workspace Sign Up */}
            <div className="mb-5 space-y-3">
              <button
                type="button"
                onClick={() => setGoogleModalOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all text-on-surface font-title-md text-xs font-bold cursor-pointer border border-outline-variant/40 shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full h-px bg-outline-variant/30" />
                <span className="absolute bg-surface-container-lowest px-3 text-[11px] font-bold text-outline uppercase tracking-wider">
                  Or register with details below
                </span>
              </div>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              
              {/* PHOTO UPLOADER SECTION */}
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Uploaded Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary ring-4 ring-primary/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-outline group-hover:border-primary transition-colors">
                      <Camera className="w-6 h-6 text-outline group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-bold mt-1">Add Photo</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Custom Photo"
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
                  <div>
                    <h3 className="font-display text-xs font-bold text-on-surface">
                      Profile Photo &amp; Clinical Avatar
                    </h3>
                    <p className="text-[11px] text-outline">
                      Upload your real picture or choose a patient preset below.
                    </p>
                  </div>

                  {/* Preset Avatar Chips */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    {SAMPLE_AVATARS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setAvatarUrl(s.url)}
                        className={`relative rounded-full transition-transform hover:scale-105 cursor-pointer ${
                          avatarUrl === s.url ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={`Select ${s.label}`}
                      >
                        <img
                          src={s.url}
                          alt={s.label}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {avatarUrl === s.url && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-2.5 rounded-full bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3 text-primary" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface" htmlFor="regFullName">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="regFullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Elena Vance"
                    className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface" htmlFor="regEmail">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="regEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@sweetycare.io"
                    className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/40"
                  />
                </div>
              </div>

              {/* MEASUREMENT STANDARDS MATRIX: US IMPERIAL VS UK / METRIC */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Measurement Standards Matrix</span>
                  <span className="text-[11px] text-outline">Switch between US Imperial (lbs, ft) and UK / International Metric (kg, cm)</span>
                </div>
                <div className="inline-flex p-1 bg-surface-container rounded-lg gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUnitMatrixSwitch('us')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      unitMatrix === 'us'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    🇺🇸 US (lbs / ft)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitMatrixSwitch('uk')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      unitMatrix === 'uk'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    🇬🇧 UK / Intl (kg / cm)
                  </button>
                </div>
              </div>

              {/* Physical Demographics: Age, Height, Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Age */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface" htmlFor="regAge">
                    Age
                  </label>
                  <input
                    id="regAge"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Height Input (US: ft + in, UK: cm) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Height ({unitMatrix === 'us' ? 'ft & in' : 'cm'})
                  </label>
                  {unitMatrix === 'us' ? (
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="3"
                          max="7"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          className="w-full h-10 pl-2.5 pr-6 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                        />
                        <span className="absolute right-2 top-2.5 text-[10px] font-bold text-outline">ft</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          className="w-full h-10 pl-2.5 pr-6 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                        />
                        <span className="absolute right-2 top-2.5 text-[10px] font-bold text-outline">in</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        min="90"
                        max="250"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-outline">cm</span>
                    </div>
                  )}
                </div>

                {/* Weight Input (US: lbs, UK: kg) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">
                    Weight ({unitMatrix === 'us' ? 'lbs' : 'kg'})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="30"
                      max="400"
                      value={unitMatrix === 'us' ? weightLbs : weightKg}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (unitMatrix === 'us') {
                          setWeightLbs(val);
                          setWeightKg((parseFloat(val || 0) * 0.453592).toFixed(1));
                        } else {
                          setWeightKg(val);
                          setWeightLbs(Math.round(parseFloat(val || 0) * 2.20462).toString());
                        }
                      }}
                      className="w-full h-10 pl-3 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-outline">
                      {unitMatrix === 'us' ? 'lbs' : 'kg'}
                    </span>
                  </div>
                </div>
              </div>

              {/* WORLDWIDE PHONE NUMBER WITH COUNTRY CODE & FLAG SELECTOR */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-outline">
                    Worldwide Country Codes Supported
                  </span>
                </div>
                <InternationalPhoneInput
                  value={phone}
                  onChange={(fullNumber) => setPhone(fullNumber)}
                />
              </div>

              {/* Clinical Context Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Diabetes Diagnosis Context
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  {[
                    { id: 't1d', label: 'Type 1 Diabetes' },
                    { id: 't2d', label: 'Type 2 Diabetes' },
                    { id: 'prediabetes', label: 'Gestational / Pre' },
                    { id: 'caregiver', label: 'Diabetic Wellness' }
                  ].map((ctx) => (
                    <button
                      key={ctx.id}
                      type="button"
                      onClick={() => setDiabetesContext(ctx.id)}
                      className={`py-2 px-2 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        diabetesContext === ctx.id
                          ? 'bg-primary text-on-primary shadow-xs font-bold'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {ctx.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Field with Dynamic Strength Meter */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface" htmlFor="passwordField">
                    Account Password <span className="text-primary">*</span>
                  </label>
                  <span className={`text-[11px] ${strength.color}`}>
                    {strength.text}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="passwordField"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 px-3 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface flex items-center cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength 4-bar indicator */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((barNum) => (
                    <div
                      key={barNum}
                      className={`h-1.5 rounded-full transition-colors duration-200 ${
                        strength.score >= barNum
                          ? strength.score === 1
                            ? 'bg-error'
                            : strength.score === 2
                            ? 'bg-secondary'
                            : strength.score === 3
                            ? 'bg-primary/80'
                            : 'bg-primary'
                          : 'bg-surface-container-high'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="termsConsent"
                  type="checkbox"
                  required
                  checked={termsConsent}
                  onChange={(e) => setTermsConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                />
                <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="termsConsent">
                  I consent to continuous clinical telemetry processing under <span className="text-primary font-semibold underline">HIPAA &amp; GDPR standards</span>.
                </label>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span>Creating Clinical Profile...</span>
                ) : (
                  <>
                    <span>Create Profile &amp; Open Dashboard</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>

              {/* One-click Demo Button */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full h-10 bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold rounded-xl border border-primary/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Or Enter Demo Account (Elena Vance)</span>
              </button>

              {/* Sign In Redirect */}
              <div className="text-center pt-2">
                <span className="text-xs text-on-surface-variant">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => onNavigate?.('signin')}
                  className="text-xs text-primary font-bold ml-1 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>

        </div>
        {/* Google Authentication Modal */}
        <GoogleAuthModal
          isOpen={googleModalOpen}
          onClose={() => setGoogleModalOpen(false)}
          onSuccess={() => onSuccess?.()}
        />

      </main>
    </div>
  );
};
