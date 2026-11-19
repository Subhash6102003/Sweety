import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { GoogleAuthModal } from '../components/GoogleAuthModal';
import { AppleAuthModal } from '../components/AppleAuthModal';

export const SignIn = ({ onNavigate, onSuccess }) => {
  const { login, requestEmailCode, loginWithEmailCode } = useAuth();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [appleModalOpen, setAppleModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('password'); // 'password' | 'emailCode'
  const [email, setEmail] = useState('demo@sweety.app');
  const [password, setPassword] = useState('Password123!');
  const [emailCode, setEmailCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    if (authMode === 'emailCode') {
      if (!codeSent) {
        // Step 1: Request 6-digit OTP code sent via SMTP
        try {
          const res = await requestEmailCode(email);
          setCodeSent(true);
          setInfoMessage(res.message || `Verification code sent to ${email}`);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to dispatch email verification code.');
          setLoading(false);
        }
      } else {
        // Step 2: Verify code and login
        try {
          await loginWithEmailCode(email, emailCode);
          setVerifiedSuccess(true);
          setTimeout(() => {
            onSuccess?.();
          }, 600);
        } catch (err) {
          setError(err.message || 'Invalid or expired verification code.');
          setLoading(false);
        }
      }
      return;
    }

    try {
      await login(email, password);
      setVerifiedSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 600);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('demo@sweety.app');
    setPassword('Password123!');
    setError('');
    setLoading(true);

    try {
      await login('demo@sweety.app', 'Password123!');
      setVerifiedSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to authenticate demo account.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center relative overflow-hidden py-8 px-4 selection:bg-primary/20">
      
      {/* Top Header Navigation Strip */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-4 z-20">
        <button
          type="button"
          onClick={() => onNavigate?.('landing')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <ThemeSelector align="right" />
        </div>
      </div>

      <main className="w-full max-w-5xl relative z-10">
        {/* Warm Kinetic Ambient Flares in Soft Rose & Crimson */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-secondary-container opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-primary opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] rounded-full bg-surface-container opacity-50 blur-[110px] pointer-events-none" />

        {/* Main Split/Bento Auth Shell */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl shadow-2xl bg-surface-container-lowest overflow-hidden border border-outline-variant/30">
          
          {/* Left Column: Primary Auth Gateway (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Brand Header Bar */}
              <div className="flex items-center justify-between pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md">
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      vital_signs
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-2xl tracking-tight text-on-surface font-extrabold">
                        Sweety
                      </span>
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    </div>
                    <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-bold">
                      Continuous Glucose Intelligence
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Sensor Hub v4.2</span>
                </div>
              </div>

              {/* Typography Heading */}
              <div className="mt-2">
                <h1 className="font-display text-3xl font-extrabold text-on-surface tracking-tight">
                  Welcome back
                </h1>
                <p className="font-body-md text-on-surface-variant mt-1.5 max-w-md">
                  Sign in to access your glucose telemetry, AGP analytics, and connected care records.
                </p>
              </div>

              {/* Quick Social & Health Gateway Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(true)}
                  className="group flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all text-on-surface font-title-md text-sm font-semibold cursor-pointer border border-outline-variant/30"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Google Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAppleModalOpen(true)}
                  className="group flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl bg-black hover:bg-gray-900 transition-all text-white font-title-md text-sm font-semibold cursor-pointer border border-black shadow-xs"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.99-9.03-10.74-19.34-14.25-30.93-3.51-11.59-5.27-22.65-5.27-33.19 0-14.44 3.51-26.4 10.53-35.87 7.02-9.47 16.03-14.33 27.04-14.59 5.37 0 11.02 1.37 16.96 4.12 5.94 2.74 9.94 4.18 12.01 4.31 1.63-.26 5.86-1.77 12.69-4.53 6.83-2.76 12.44-4.04 16.84-3.84 13.06.66 23.46 5.32 31.2 13.98-11.45 6.94-17.06 16.48-16.83 28.61.23 9.47 3.86 17.51 10.89 24.12 7.03 6.61 15.42 10.33 25.18 11.16-2.04 6.25-4.47 12.55-7.31 18.9zM119.22 31.84c0-7.39 2.66-14.39 7.97-21.01 5.31-6.62 11.75-10.83 19.33-12.63.26 1.45.39 2.82.39 4.12 0 7.39-2.75 14.43-8.24 21.12-5.49 6.69-11.97 10.8-19.45 12.33-.27-1.32-.4-2.63-.4-3.93z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>

              {/* Section Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full h-px bg-outline-variant/50" />
                <span className="absolute px-3 bg-surface-container-lowest text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
                  Or continue with email
                </span>
              </div>

              {/* Auth Mode Toggle Tabs (Email Code OTP vs Password) */}
              <div className="flex rounded-xl bg-surface-container-low p-1 mb-4 border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => { setAuthMode('emailCode'); setError(''); setInfoMessage(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'emailCode'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Email Code (Passwordless)
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('password'); setError(''); setInfoMessage(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'password'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Password Login
                </button>
              </div>

              {/* Info Notice */}
              {infoMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Auth Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                  <label className="block font-title-md text-sm text-on-surface font-semibold mb-1.5" htmlFor="email">
                    Patient Email Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant pointer-events-none text-[20px]">
                      alternate_email
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      disabled={authMode === 'emailCode' && codeSent}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@sweetycare.io"
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/25 border border-outline-variant/40 disabled:opacity-75"
                    />
                  </div>
                </div>

                {/* Password Mode: Password Input */}
                {authMode === 'password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-title-md text-sm text-on-surface font-semibold" htmlFor="password">
                        Access Key / Password
                      </label>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('For this demo, use: Password123!'); }}
                        className="font-label-sm text-xs text-primary hover:underline transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant pointer-events-none text-[20px]">
                        lock
                      </span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-11 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface font-body-md outline-none transition-all placeholder:text-outline/70 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/25 border border-outline-variant/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                        className="absolute right-3.5 text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Code Mode: 6-Digit Code Input */}
                {authMode === 'emailCode' && codeSent && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-title-md text-sm text-on-surface font-semibold" htmlFor="emailCode">
                        6-Digit Security Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setCodeSent(false)}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Change Email
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant pointer-events-none text-[20px]">
                        key
                      </span>
                      <input
                        id="emailCode"
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="123456"
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-display text-lg tracking-widest text-center font-bold outline-none transition-all placeholder:text-outline/50 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/25 border border-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-xs text-outline">
                      <span>Check your inbox &amp; spam folder</span>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-primary font-bold hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                {/* Preferences / Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="rememberDevice"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                    />
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Remember this trusted device for 30 days
                    </span>
                  </label>
                  <span className="hidden sm:inline-flex items-center gap-1 font-label-sm text-xs text-tertiary font-semibold">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    SMTP Active
                  </span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-11 mt-2 rounded-xl text-on-primary font-title-md text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
                    verifiedSuccess
                      ? 'bg-tertiary-container'
                      : 'bg-primary hover:bg-primary-container'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>{authMode === 'emailCode' && !codeSent ? 'Sending Code via SMTP...' : 'Verifying Session...'}</span>
                    </>
                  ) : verifiedSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Credentials Verified</span>
                    </>
                  ) : authMode === 'emailCode' ? (
                    codeSent ? (
                      <>
                        <span>Verify Code &amp; Sign In</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Code to Email</span>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </>
                    )
                  ) : (
                    <>
                      <span>Sign In to Sweety</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Instant Demo Account Access Button */}
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-title-md text-sm font-bold flex items-center justify-center gap-2 border border-primary/20 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    vital_signs
                  </span>
                  <span>Sign In with Demo Account (Elena Vance)</span>
                </button>
              </form>

              {/* Create Account Callout */}
              <div className="mt-6 text-center font-body-md text-sm text-on-surface-variant">
                Don't have an active telemetry profile?
                <button
                  type="button"
                  onClick={() => onNavigate?.('register')}
                  className="text-primary font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Create an account / Get Started
                </button>
              </div>
            </div>

            {/* Security Guarantee Footnote */}
            <div className="pt-4 mt-6 border-t-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant font-body-sm text-xs bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span className="font-semibold text-on-surface">AES-256 Bit Encryption</span>
              </div>
              <span className="text-outline text-center sm:text-right">HIPAA &amp; GDPR Compliant Telemetry Gateway</span>
            </div>
          </div>

          {/* Right Column: Micro-Telemetry Insights & Device Pairing Panel (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-low p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-outline-variant/30">
            {/* Decorative radial gradient glow inside card */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-secondary-container opacity-30 blur-2xl pointer-events-none" />

            {/* Section Top: Live CGM Telemetry Preview Tile */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-[10px] font-bold shadow-xs border border-outline-variant/30">
                    LIVE CGM STREAM
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Sample Telemetry</span>
                </div>
                <span className="font-label-sm text-xs text-secondary font-bold">TIR: 94.2%</span>
              </div>

              {/* Metric Card Banner */}
              <div className="mt-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm flex items-center justify-between border border-outline-variant/30">
                <div>
                  <div className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Current Baseline
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-3xl text-on-surface font-extrabold tracking-tight tabular-nums">
                      108
                    </span>
                    <span className="font-title-md text-sm text-on-surface-variant font-medium">
                      mg/dL
                    </span>
                    <span className="inline-flex items-center text-primary font-bold text-xs ml-1">
                      <span className="material-symbols-outlined text-[16px]">trending_flat</span> Steady
                    </span>
                  </div>
                </div>

                {/* Gauge Mini Chart */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" fill="none" opacity="0.3" r="19" stroke="currentColor" className="text-secondary-container" strokeWidth="5" />
                    <circle cx="24" cy="24" fill="none" r="19" stroke="currentColor" className="text-primary" strokeDasharray="119.38" strokeDashoffset="24" strokeLinecap="round" strokeWidth="5" />
                  </svg>
                  <span className="material-symbols-outlined absolute text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </div>
              </div>

              {/* Interactive Ambulatory Glucose Profile Micro Chart */}
              <div className="mt-4 p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between pb-2">
                  <span className="font-title-md text-sm text-on-surface font-bold">AGP 24h Distribution</span>
                  <span className="font-label-sm text-xs text-on-surface-variant font-medium">70 - 140 Target</span>
                </div>

                {/* Vector Sparkline with Gradient fill */}
                <div className="h-20 w-full relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 280 80">
                    <defs>
                      <linearGradient id="cgmGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Target Band Guideline */}
                    <rect fill="var(--surface-container)" height="38" opacity="0.7" rx="4" width="280" x="0" y="24" />
                    <line opacity="0.4" stroke="var(--outline)" strokeDasharray="3 3" x1="0" x2="280" y1="24" y2="24" />
                    <line opacity="0.4" stroke="var(--outline)" strokeDasharray="3 3" x1="0" x2="280" y1="62" y2="62" />
                    {/* Curve Fill */}
                    <path d="M 0 52 Q 35 48, 70 38 T 140 32 T 210 44 T 280 34 L 280 80 L 0 80 Z" fill="url(#cgmGradient)" />
                    {/* Curve Line */}
                    <path d="M 0 52 Q 35 48, 70 38 T 140 32 T 210 44 T 280 34" fill="none" stroke="var(--primary)" strokeLinecap="round" strokeWidth="2.5" />
                    {/* Current Node */}
                    <circle cx="280" cy="34" fill="var(--surface)" r="4.5" stroke="var(--primary)" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="flex justify-between items-center text-outline font-label-sm text-xs pt-2">
                  <span>04:00</span>
                  <span>10:00</span>
                  <span>16:00</span>
                  <span className="text-primary font-bold">Now</span>
                </div>
              </div>

              {/* Clinical Insights Testimonial / Telemetry Stat */}
              <div className="mt-4 p-4 rounded-2xl bg-surface-container text-on-surface border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    insights
                  </span>
                  <span className="font-title-md text-sm font-bold">Intelligent Prediction Engine</span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Proprietary algorithmic forecasting predicts hypoglycemic events up to 45 minutes ahead with 98.4% clinical precision.
                </p>
              </div>
            </div>

            {/* Section Bottom: Device Pairing Readiness */}
            <div className="relative z-10 pt-4 mt-4">
              <div className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-2">
                Sync Architecture Ready
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Dexcom Pairing Status */}
                <div className="p-3 rounded-xl bg-surface-container-lowest flex items-center justify-between shadow-xs border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex flex-col">
                      <span className="font-title-md text-xs text-on-surface font-bold leading-tight">Dexcom G7</span>
                      <span className="font-label-sm text-[10px] text-tertiary font-semibold">Direct Link</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-primary">bluetooth_connected</span>
                </div>

                {/* FreeStyle Libre Pairing Status */}
                <div className="p-3 rounded-xl bg-surface-container-lowest flex items-center justify-between shadow-xs border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <div className="flex flex-col">
                      <span className="font-title-md text-xs text-on-surface font-bold leading-tight">Libre 3 Plus</span>
                      <span className="font-label-sm text-[10px] text-tertiary font-semibold">NFC Ready</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-primary">sensors</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Global Legal & Security Footer Micro-Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-outline font-body-sm text-xs">
          <a className="hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
          <span className="inline-block w-1 h-1 rounded-full bg-outline" />
          <a className="hover:text-on-surface transition-colors" href="#">HIPAA Compliance</a>
          <span className="inline-block w-1 h-1 rounded-full bg-outline" />
          <a className="hover:text-on-surface transition-colors" href="#">Terms of Telemetry Service</a>
          <span className="inline-block w-1 h-1 rounded-full bg-outline" />
          <a className="hover:text-on-surface transition-colors" href="#">Support &amp; Sensor Calibration</a>
        </div>
        {/* Google Authentication Modal */}
        <GoogleAuthModal
          isOpen={googleModalOpen}
          onClose={() => setGoogleModalOpen(false)}
          onSuccess={() => onSuccess?.()}
        />

        {/* Apple ID Authentication Modal */}
        <AppleAuthModal
          isOpen={appleModalOpen}
          onClose={() => setAppleModalOpen(false)}
          onSuccess={() => onSuccess?.()}
        />

      </main>
    </div>
  );
};
