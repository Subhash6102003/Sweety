import React, { useState, useEffect } from 'react';
import { ThemeSelector } from '../components/ThemeSelector';

/**
 * Sweety Blood Glucose Tracker — Comprehensive Clinical Landing Page
 * 100% Full-Fidelity Reconstruction matching Google Stitch Specification (844 lines)
 * 
 * 11 Standard Clinical Sections:
 * 1. Sticky Navigation Header with ThemeSelector & Anchors
 * 2. Hero Section with Live CGM Chip, 60px Headline, Dual CTAs & Micro-Proof
 * 3. Interactive Telemetry Hero Mockup with Real-time AGP Curve & Status Pills
 * 4. Compliance & Trust Bar with 9 Clinical Certifications & Partners
 * 5. Lifestyle & Sensor Image Strip (3 High-Res Photographic Cards)
 * 6. 6 Platform Capabilities Bento Grid (Six Pillars of Glycemic Mastery)
 * 7. 3-Step Workflow ("How Sweety Works")
 * 8. Clinical Outcomes & Deep Metrics Matrix + 6-Row Comparison Table
 * 9. Testimonials & Clinical Endorsements (Physician, T1D Patient, Caregiver)
 * 10. Interactive Pricing Preview (Monthly vs Annual Toggle with 20% Discount Math)
 * 11. High-Conversion Bottom CTA Banner & 5-Column Clinical/HIPAA Footer
 */

export const LandingPage = ({
  onGetStarted,
  onLaunchApp,
  onSignIn,
  onRegister
}) => {
  const handleLaunch = onLaunchApp || onGetStarted;
  const handleSignIn = onSignIn;
  const handleRegister = onRegister || onGetStarted;

  // Interactive Pricing Billing Toggle: 'monthly' vs 'annual'
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Mobile Navigation Drawer Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Product Tour Modal
  const [tourModalOpen, setTourModalOpen] = useState(false);

  // Live seconds ticker for telemetry sync indicator
  const [syncSeconds, setSyncSeconds] = useState(12);
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncSeconds((prev) => (prev >= 60 ? 5 : prev + 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll handler for anchor links
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col selection:bg-primary/20">
      
      {/* =========================================================================
          SECTION 1: TOP GLOBAL STICKY NAVIGATION HEADER
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(173,39,55,0.06)] border-b border-outline-variant/30">
        <div className="h-16 w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center space-x-8">
            <a
              href="#"
              className="flex items-center space-x-2.5 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_2px_8px_rgba(173,39,55,0.25)] transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-on-primary text-[20px]">
                  vital_signs
                </span>
              </div>
              <span className="font-display text-xl lg:text-headline-sm text-on-surface tracking-tight font-extrabold">
                Sweety
              </span>
            </a>

            {/* Desktop Navigation Links matching Image 2 exactly */}
            <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className="font-title-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-150 whitespace-nowrap"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="font-title-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-150 whitespace-nowrap"
              >
                How It Works
              </a>
              <a
                href="#clinical-solutions"
                onClick={(e) => scrollToSection(e, 'clinical-solutions')}
                className="font-title-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-150 whitespace-nowrap"
              >
                Clinical Solutions
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                className="font-title-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-150 whitespace-nowrap"
              >
                Pricing
              </a>
              <a
                href="#security-hipaa"
                onClick={(e) => scrollToSection(e, 'security-hipaa')}
                className="font-title-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-150 whitespace-nowrap"
              >
                Security &amp; HIPAA
              </a>
            </nav>
          </div>

          {/* Right Actions: Theme Selector, Sign In, Register */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Live 4-Theme Clinical Switcher */}
            <ThemeSelector align="right" />

            {/* Sign In CTA */}
            <button
              type="button"
              onClick={handleSignIn}
              className="h-9 px-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors hidden sm:inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
            >
              Sign In
            </button>

            {/* Launch App / Get Started Free CTA */}
            <button
              type="button"
              onClick={handleRegister}
              className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container active:scale-95 text-on-primary text-xs font-bold shadow-xs flex items-center justify-center transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Get Started Free</span>
            </button>

            {/* User Profile Avatar Indicator */}
            <button
              type="button"
              onClick={handleSignIn}
              title="Patient & Clinician Portal"
              className="w-9 h-9 rounded-full bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 transition-all cursor-pointer hidden md:flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                person
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface border-b border-outline-variant/30 px-6 py-4 flex flex-col gap-3 shadow-lg">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="py-2 text-on-surface font-semibold hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="py-2 text-on-surface font-semibold hover:text-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="#clinical-solutions"
              onClick={(e) => scrollToSection(e, 'clinical-solutions')}
              className="py-2 text-on-surface font-semibold hover:text-primary transition-colors"
            >
              Clinical Solutions
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="py-2 text-on-surface font-semibold hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              onClick={(e) => scrollToSection(e, 'testimonials')}
              className="py-2 text-on-surface font-semibold hover:text-primary transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#security-hipaa"
              onClick={(e) => scrollToSection(e, 'security-hipaa')}
              className="py-2 text-on-surface font-semibold hover:text-primary transition-colors"
            >
              Security &amp; HIPAA
            </a>
            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignIn?.();
                }}
                className="text-primary font-bold py-2"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunch?.();
                }}
                className="px-4 py-2 bg-primary text-white font-bold rounded-lg"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Landing Canvas offset by sticky header */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-16rem)] flex-1">
        <div className="flex flex-col w-full">

          {/* =========================================================================
              SECTION 2: HERO SECTION (Continuous Glucose Intelligence)
              ========================================================================= */}
          <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface pb-space-xl pt-space-lg lg:pt-space-xl">
            {/* Ambient Tonal Gradient Spheres */}
            <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
              
              {/* Eyebrow Status Badges */}
              <div className="flex flex-wrap items-center gap-space-xs mb-space-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm shadow-xs border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Dexcom G6/G7 &amp; Libre 2/3 Live Telemetry
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/35 text-secondary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bolt
                  </span>
                  Sub-second Cloud Streaming
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm hidden sm:inline-flex">
                  <span className="material-symbols-outlined text-[15px]">
                    verified
                  </span>
                  4.2% MARD Sensor Precision
                </span>
              </div>

              {/* Hero Header, Subtext & CTA Group */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-start">
                
                {/* Left Hero Content Column matching Image 2 */}
                <div className="lg:col-span-7 flex flex-col">
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] text-on-surface tracking-tight mb-space-md leading-[1.14] font-extrabold max-w-2xl">
                    Continuous Glucose Intelligence,<br className="hidden sm:inline" />{' '}
                    <span className="text-primary underline decoration-secondary-container decoration-4 underline-offset-4">
                      Effortlessly Mastered.
                    </span>
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg leading-relaxed">
                    Empowering Type 1 and Type 2 diabetics with continuous real-time CGM sync, predictive AGP analytics, AI-assisted meal-bolus modeling, and collaborative clinical care team oversight.
                  </p>

                  {/* Dual Primary CTAs */}
                  <div className="flex flex-wrap items-center gap-space-md mb-space-lg">
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="h-11 px-7 rounded-lg bg-primary hover:bg-primary-container active:scale-95 text-on-primary font-title-md text-title-md shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Start 14-Day Free Trial</span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTourModalOpen(true)}
                      className="h-11 px-5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-on-surface font-title-md text-title-md flex items-center gap-2 shadow-xs border border-outline-variant/30 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_circle
                      </span>
                      <span>Watch Product Tour (2 min)</span>
                    </button>
                  </div>

                  {/* Micro Social Metrics & Cohort Proof */}
                  <div className="flex flex-wrap items-center gap-space-lg pt-space-xs border-t border-outline-variant/20 lg:border-t-0">
                    <div className="flex -space-x-2 overflow-hidden">
                      <div className="inline-block h-8 w-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold shadow-xs">
                        EV
                      </div>
                      <div className="inline-block h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold shadow-xs">
                        RM
                      </div>
                      <div className="inline-block h-8 w-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-label-sm text-label-sm font-bold shadow-xs">
                        MD
                      </div>
                      <div className="inline-block h-8 w-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-sm text-label-sm font-bold shadow-xs">
                        +45k
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center text-primary">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-title-md text-title-md text-on-surface ml-1 font-bold tabular-nums">4.9/5</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        45,000+ patient-days tracked across US &amp; EU
                      </span>
                    </div>

                    {/* Quick Clinical Stat Strip */}
                    <div className="hidden sm:flex items-center gap-4 text-xs text-on-surface-variant font-medium">
                      <span className="px-2.5 py-1 rounded bg-surface-container-high font-semibold text-primary tabular-nums">
                        14.2% Mean TIR Improvement
                      </span>
                      <span className="px-2.5 py-1 rounded bg-surface-container-high font-semibold text-tertiary tabular-nums">
                        100% HIPAA &amp; SOC2
                      </span>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SECTION 3: INTERACTIVE TELEMETRY HERO MOCKUP CARD
                    ========================================================================= */}
                <div id="telemetry-preview" className="lg:col-span-5 w-full">
                  <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-xl border border-outline-variant/30 overflow-hidden">
                    
                    {/* Top Status Bar of Card */}
                    <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                        <span className="font-label-md text-label-md text-on-surface uppercase tracking-wide font-bold">
                          Live CGM Telemetry
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                          Dexcom G7
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">
                        Sync: {syncSeconds}s ago
                      </span>
                    </div>

                    {/* Glucose Big Metric & Stability Grid */}
                    <div className="grid grid-cols-2 gap-space-sm mb-space-md">
                      {/* Current Glucose Well */}
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                          Current Glucose
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-display text-[46px] font-extrabold text-on-surface leading-none tabular-nums">
                            108
                          </span>
                          <div className="flex items-center text-primary font-title-md">
                            <span className="material-symbols-outlined text-[24px]">trending_up</span>
                            <span className="font-bold text-[13px] ml-0.5 tabular-nums">+2 mg/dL</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="inline-flex h-2 w-2 rounded-full bg-tertiary" />
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                            Optimal Target (70–140)
                          </span>
                        </div>
                      </div>

                      {/* Metabolic Stability Well */}
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                            Metabolic Stability
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-secondary-container/50 text-secondary font-label-sm text-[10px] font-bold">
                            GRADE A
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-data-metric text-data-metric text-on-surface tabular-nums">
                            88
                          </span>
                          <span className="font-body-md text-body-md text-on-surface-variant">
                            /100
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
                          <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: '88%' }} />
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 tabular-nums">
                          CV: 21.4% (Target &lt;36%)
                        </span>
                      </div>
                    </div>

                    {/* 24H Continuous AGP Corridor Visualization SVG */}
                    <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm border border-outline-variant/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                          24h Continuous AGP Corridor
                        </span>
                        <span className="font-label-sm text-label-sm text-primary font-bold tabular-nums">
                          94% Time-in-Range
                        </span>
                      </div>

                      {/* SVG Canvas with Dynamic Themed Fill & Stroke */}
                      <div className="w-full h-32 relative">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 360 120">
                          <defs>
                            <linearGradient id="heroTargetBandGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                              <stop offset="0%" stopColor="var(--secondary-container, #feaeba)" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="var(--secondary-container, #feaeba)" stopOpacity="0.08" />
                            </linearGradient>
                            <linearGradient id="heroLineGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                              <stop offset="0%" stopColor="var(--secondary, #8a4c57)" />
                              <stop offset="50%" stopColor="var(--primary, #ad2737)" />
                              <stop offset="100%" stopColor="var(--primary-container, #cf414d)" />
                            </linearGradient>
                          </defs>

                          {/* Target Corridor Box (70 to 140 mg/dL scaled roughly between y=35 and y=85) */}
                          <rect x="0" y="32" width="360" height="52" rx="4" fill="url(#heroTargetBandGrad)" />
                          <line x1="0" y1="32" x2="360" y2="32" stroke="var(--secondary-container, #feaeba)" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />
                          <line x1="0" y1="84" x2="360" y2="84" stroke="var(--secondary-container, #feaeba)" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />
                          <line x1="0" y1="16" x2="360" y2="16" stroke="var(--outline-variant, #e0bfbe)" strokeDasharray="2 2" strokeWidth="1" opacity="0.4" />

                          {/* Target corridor numeric labels */}
                          <text x="5" y="44" fill="var(--secondary, #8a4c57)" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="600">140</text>
                          <text x="5" y="80" fill="var(--secondary, #8a4c57)" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="600">70</text>
                          <text x="330" y="14" fill="var(--outline, #8c7070)" fontFamily="Inter" fontSize="7">180 (High)</text>

                          {/* Continuous AGP Spline Wave Curve */}
                          <path
                            d="M 0,65 Q 40,48 80,55 T 160,42 T 220,68 T 280,58 T 330,48 T 360,52"
                            fill="none"
                            stroke="url(#heroLineGrad)"
                            strokeLinecap="round"
                            strokeWidth="3"
                          />

                          {/* Real-time telemetry cursor */}
                          <circle cx="360" cy="52" r="5" fill="var(--primary, #ad2737)" />
                          <circle cx="360" cy="52" r="9" fill="var(--primary, #ad2737)" opacity="0.3" className="animate-ping" />

                          {/* Excursion pin: Oatmeal + Protein marker */}
                          <circle cx="160" cy="42" r="3" fill="#ffffff" stroke="var(--primary, #ad2737)" strokeWidth="2" />
                          <line x1="160" y1="18" x2="160" y2="38" stroke="var(--on-surface-variant, #594141)" strokeDasharray="2 2" strokeWidth="1" opacity="0.5" />
                          <text x="135" y="14" fill="var(--on-surface-variant, #594141)" fontFamily="Inter" fontSize="8" fontWeight="600">
                            Oatmeal + Protein
                          </text>
                        </svg>
                      </div>

                      {/* Time Axis Bar */}
                      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[10px] pt-1">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span className="font-bold text-on-surface">Now (21:40)</span>
                      </div>
                    </div>

                    {/* Hypo Shield Alert & Active IOB Status Pills */}
                    <div className="grid grid-cols-2 gap-2 mb-space-sm">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-high border border-outline-variant/20">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                            Hypo Shield Active
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant tabular-nums">
                            0 drops predicted (4h)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-high border border-outline-variant/20">
                        <div className="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-secondary text-[18px]">water_drop</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate tabular-nums">
                            Active IOB: 0.85 U
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant tabular-nums">
                            Decay zero in 54m
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3 Mini Telemetry Summary Tiles */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/20 text-center">
                      <div className="p-1.5 rounded bg-surface-container-low">
                        <span className="block text-[10px] text-on-surface-variant uppercase font-semibold">TIR (24h)</span>
                        <span className="font-title-md font-bold text-primary tabular-nums">88%</span>
                      </div>
                      <div className="p-1.5 rounded bg-surface-container-low">
                        <span className="block text-[10px] text-on-surface-variant uppercase font-semibold">Est. HbA1c</span>
                        <span className="font-title-md font-bold text-secondary tabular-nums">5.8%</span>
                      </div>
                      <div className="p-1.5 rounded bg-surface-container-low">
                        <span className="block text-[10px] text-on-surface-variant uppercase font-semibold">Active Insulin</span>
                        <span className="font-title-md font-bold text-on-surface tabular-nums">4.1u</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* =========================================================================
                  SECTION 4: COMPLIANCE & TRUST BAR
                  ========================================================================= */}
              <div id="security-hipaa" className="mt-space-xl pt-space-lg bg-surface-container-low/70 border border-outline-variant/30 rounded-xl p-space-md">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-space-md">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold text-center lg:text-left">
                    Trusted by 45,000+ Diabetic Patients &amp; Integrated with Leading Platforms
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-space-sm text-on-surface-variant">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                      <span className="font-title-md text-label-md text-on-surface">FDA Class II Interoperable</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary text-[18px]">health_and_safety</span>
                      <span className="font-title-md text-label-md text-on-surface">HIPAA BAA Signed</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
                      <span className="font-title-md text-label-md text-on-surface">SOC2 Type II Certified</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                      <span className="font-title-md text-label-md text-on-surface">256-bit AES Vault</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                      <span className="material-symbols-outlined text-secondary text-[18px]">local_hospital</span>
                      <span className="font-title-md text-label-md text-on-surface">Stanford Medicine BioDesign</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-xs border border-outline-variant/30">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">science</span>
                      <span className="font-title-md text-label-md text-on-surface">ADA Research Partner</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* =========================================================================
              SECTION 5: LIFESTYLE IMAGE STRIP SECTION
              ========================================================================= */}
          <section className="w-full bg-surface py-space-lg">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                
                {/* Photo Card 1: Precision Capillary Testing / Meal Dosing */}
                <div className="relative h-64 rounded-xl overflow-hidden shadow-xs group border border-outline-variant/30">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="A modern young adult checking continuous glucose telemetry on their smartphone while having a fresh nutritious Mediterranean meal in a sunlit kitchen, high key warm morning lighting."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNxEz_dtceh4VhIVLe4R1txk2VRFH4Ub9Kp1PyhzPA3URFEQred9fwn6daMBpTPXfiVUMhwd9bcDIzxzCOKAc4SoTBJJyBbc2jEnw6942anQos0__XlR59zsi21xuvLTNCSTE8QDJVbpruoTcK_r4FGnaZ2wzDGg1j6smXRfp4ZEVBQiKtxvcnCuCpKTWcW1cw_1jgsfp30slcuJo50bS7ZUf-QfReE1sn5KPnzg"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex flex-col justify-end p-space-md text-inverse-on-surface">
                    <span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-wider font-semibold">
                      Real-time Daily Living
                    </span>
                    <span className="font-title-md text-title-md font-bold text-white">
                      Predictive Pre-Meal Dosing
                    </span>
                  </div>
                </div>

                {/* Photo Card 2: Arm-Worn Sensor / Workout Telemetry */}
                <div className="relative h-64 rounded-xl overflow-hidden shadow-xs group border border-outline-variant/30">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Close up shot of an active runner checking wearable smartwatch biometric data displaying glucose curve during a morning park workout, vibrant morning sun flare."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVlwQHhkrgcVpNW0U2daXLuyG62TASI-Mtq0JqErC8pV11gtH6iq4llX37yNttc10C3fV3Vgw6YlammfdL7eCjyfo6dMB7_uwYJjIIiXfn3Nv7iomO98DpzjZKBiiqZNm-lq7NuFZzg8Ci9c735lJZcppZRMhNfOeQIthr7AOLReCpD6qh5qDO4fts8QkWoa4otsL9psk8kwcQhwsTPQsrp7O-CjmSSbXnt7FGvQ"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex flex-col justify-end p-space-md text-inverse-on-surface">
                    <span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-wider font-semibold">
                      Exercise Exertion Telemetry
                    </span>
                    <span className="font-title-md text-title-md font-bold text-white">
                      Workout Anaerobic Drop Shield
                    </span>
                  </div>
                </div>

                {/* Photo Card 3: Clinician Remote Care & Portal Integration */}
                <div className="relative h-64 rounded-xl overflow-hidden shadow-xs group border border-outline-variant/30">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="An endocrinologist doctor wearing white clinical coat reviewing multi-patient ambulatory glucose profiles on a modern dual-monitor workstation in a sunlit clean clinic room."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkI9yqbPV3h1QqELZUEPT1vkJJ_UzR6jJCCfe7H-r5tbsy32gH7SCZdWDy4reWWBr5MCttpbpNLR0pQZedXrYq0h9kkJUvb9j9sXCWlZNMQkVTUnNKiIx7Pc_mdsg8QidOVU3A4XlVkOaEuvlndBNXyWSaPeacQb_tVzJLdny2XXkYKt0lQ-QC-0BUc2sbQpWKe7s2FZPP-WK8QpJVyU7djnDQLHrea81tVmVbpA"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent flex flex-col justify-end p-space-md text-inverse-on-surface">
                    <span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-wider font-semibold">
                      Clinical Remote Patient Care
                    </span>
                    <span className="font-title-md text-title-md font-bold text-white">
                      Endocrinology Portal Integration
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              SECTION 6: 6 PLATFORM CAPABILITIES BENTO GRID (Six Pillars)
              ========================================================================= */}
          <section id="features" className="w-full bg-surface-container-low/40 py-space-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
                <div>
                  <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                    Engineered for Glycemic Precision
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                    Six Pillars of Continuous Glucose Mastery
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Medical-grade intelligence algorithms built to take the guesswork out of daily diabetes calculations.
                </p>
              </div>

              {/* Bento-style 6 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                
                {/* Pillar 01: Real-Time CGM Stream Sync */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">sync_saved_locally</span>
                      </div>
                      <span className="font-data-metric text-[15px] text-on-surface-variant font-bold tabular-nums">01</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      Real-Time Sub-second CGM Stream Sync
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      Instant Sub-second CGM telemetry stream sync with Dexcom G6, G7, Abbott Freestyle Libre 2/3, and Apple HealthKit. Never scan manually unless you want to.
                    </p>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
                    <span className="flex items-center gap-1 tabular-nums">
                      <span className="w-2 h-2 rounded-full bg-primary" /> 1.2s Average Latency
                    </span>
                    <span className="text-primary font-bold">Cloud Realtime</span>
                  </div>
                </div>

                {/* Pillar 02: Predictive AGP Analytics */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">analytics</span>
                      </div>
                      <span className="font-data-metric text-[15px] text-on-surface-variant font-bold tabular-nums">02</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      Predictive AGP Analytics &amp; AGP Corridors
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      Medical-grade AGP Corridors, modal day curves, CV tracking, and automated Dawn Alarms that warn you 45 minutes before nocturnal spikes occur.
                    </p>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
                    <span className="flex items-center gap-1 tabular-nums">
                      <span className="w-2 h-2 rounded-full bg-secondary" /> 45-min Predictive Horizon
                    </span>
                    <span className="text-primary font-bold">AGP Corridors &amp; TIR Consensus</span>
                  </div>
                </div>

                {/* Pillar 03: Smart Bolus & Meal AI */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">calculate</span>
                      </div>
                      <span className="font-data-metric text-[15px] text-on-surface-variant font-bold tabular-nums">03</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      Smart Bolus &amp; Meal AI
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      Track carbs, protein, and fat absorption delays. Continuous active insulin-on-board (IOB) decay prevents fatal insulin stacking errors.
                    </p>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" /> Zero Insulin Stacking
                    </span>
                    <span className="text-primary font-bold">TIR Consensus &amp; ICR</span>
                  </div>
                </div>

                {/* Pillar 04: Holistic Life Journal */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">hotel</span>
                      </div>
                      <span className="font-data-metric text-[15px] text-on-surface-variant font-bold tabular-nums">04</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      Holistic Life Journal
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      Directly correlate cortisol stress spikes, fragmented sleep, workout intensity zones, and menstrual phases with your glycemic excursions.
                    </p>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary" /> Sleep &amp; HRV Correlated
                    </span>
                    <span className="text-primary font-bold">Multi-Biomarker</span>
                  </div>
                </div>

                {/* Pillar 05: Intelligent Hypo Rescue */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">emergency_home</span>
                      </div>
                      <span className="font-data-metric text-[15px] text-on-surface-variant font-bold tabular-nums">05</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      Intelligent Hypo Rescue
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      Multi-channel critical alert escalation that bypasses Do Not Disturb and automatically dispatches GPS coordinates to family if glucose drops below 54 mg/dL.
                    </p>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" /> Auto SOS Dispatch
                    </span>
                    <span className="text-primary font-bold">Life Safety</span>
                  </div>
                </div>

                {/* Pillar 06: Provider Telemetry Portal */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">clinical_notes</span>
                      </div>
                      <span className="font-data-metric text-[15px] text-on-surface-variant font-bold tabular-nums">06</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
                      Provider Telemetry Portal
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      1-click clinical standard AGP PDF export with GMI metrics, plus secure, HIPAA-compliant real-time read access for your endocrinologist and CDCES.
                    </p>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary" /> Epic / Cerner FHIR
                    </span>
                    <span className="text-primary font-bold">Clinical Ready</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              SECTION 7: 3-STEP WORKFLOW ("How Sweety Works")
              ========================================================================= */}
          <section id="how-it-works" className="w-full bg-surface py-space-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              
              <div className="text-center max-w-2xl mx-auto mb-space-xl">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  Fast Seamless Onboarding
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                  From Sensor to Actionable Insights in 3 Simple Steps
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
                {/* Connecting Line for Desktop */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-surface-container-high -z-0" />

                {/* Step 1 */}
                <div className="relative bg-surface-container-low rounded-xl p-space-lg flex flex-col z-10 shadow-xs border border-outline-variant/30">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold mb-space-md shadow-md shadow-primary/20">
                    1
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                    Connect CGM Sensor
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                    Authorize your Dexcom Share or Abbott LibreLink account in one tap. Alternatively, log manual fingersticks via Bluetooth meter in under 10 seconds.
                  </p>
                  <div className="mt-auto pt-space-sm flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-[18px]">bluetooth</span>
                    <span>Zero hardware dongles needed</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative bg-surface-container-low rounded-xl p-space-lg flex flex-col z-10 shadow-xs border border-outline-variant/30">
                  <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm flex items-center justify-center font-bold mb-space-md shadow-md shadow-secondary/20">
                    2
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                    Adaptive AI Profiling
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                    Sweety learns your individual carb sensitivity, diurnal basal shifts, and circadian insulin response patterns across day and night periods.
                  </p>
                  <div className="mt-auto pt-space-sm flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
                    <span>Personalized within 72 hours</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative bg-surface-container-low rounded-xl p-space-lg flex flex-col z-10 shadow-xs border border-outline-variant/30">
                  <div className="w-12 h-12 rounded-xl bg-inverse-surface text-inverse-on-surface font-headline-sm text-headline-sm flex items-center justify-center font-bold mb-space-md shadow-md">
                    3
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                    Achieve TIR &gt; 85%
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                    Enjoy predictable postprandial glucose curves, quiet nighttime sleep with proactive hypo alerts, and export clinical-grade AGP reviews for your doctor.
                  </p>
                  <div className="mt-auto pt-space-sm flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm border-t border-outline-variant/20">
                    <span className="material-symbols-outlined text-on-surface text-[18px]">sentiment_very_satisfied</span>
                    <span>Peace of mind 24/7</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              SECTION 8: CLINICAL OUTCOMES & SOLO VS SWEETY COMPARISON
              ========================================================================= */}
          <section id="clinical-solutions" className="w-full bg-surface-container-low/70 py-space-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-space-xl">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  Clinically Validated Impact
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                  Numbers That Actually Change Diabetic Lives
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Aggregated cohort findings from an independently observed 6-month prospective study across 4,200 active Sweety platform users.
                </p>
              </div>

              {/* 3 Massive Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
                
                {/* Metric 1: TIR Expansion */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                      Time-in-Range (TIR)
                    </span>
                    <span className="material-symbols-outlined text-primary text-[22px]">trending_up</span>
                  </div>
                  <span className="font-display text-[48px] text-on-surface font-extrabold leading-none mb-2 tabular-nums">
                    +14.2%
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold mb-1">
                    Average TIR Expansion
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Equivalent to an extra 3.3 hours per day within the optimal 70–140 mg/dL target zone within the first 30 days of active telemetry.
                  </p>
                </div>

                {/* Metric 2: Hypo Prevention */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      Hypoglycemia Prevention
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[22px]">bedtime</span>
                  </div>
                  <span className="font-display text-[48px] text-on-surface font-extrabold leading-none mb-2 tabular-nums">
                    -62%
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold mb-1">
                    Nocturnal Lows Averted
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Dramatic drop in dangerous midnight hypoglycemic incidents (&lt;54 mg/dL) enabled by intelligent early-warning trajectory modeling.
                  </p>
                </div>

                {/* Metric 3: HbA1c Reduction */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                      Long-term Glycemic Control
                    </span>
                    <span className="material-symbols-outlined text-primary text-[22px]">vital_signs</span>
                  </div>
                  <span className="font-display text-[48px] text-on-surface font-extrabold leading-none mb-2 tabular-nums">
                    -0.6%
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold mb-1">
                    Mean HbA1c Reduction
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Clinically meaningful reduction sustained after 6 months of continuous care team collaboration and bolus optimization.
                  </p>
                </div>

              </div>

              {/* Side-by-Side Narrative Comparison */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-outline-variant/30 mb-space-lg">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-center mb-space-lg">
                  The Paradigm Shift: Manual Guesswork vs. Sweety Telemetry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                  
                  {/* Traditional / Without Sweety */}
                  <div className="p-space-md rounded-lg bg-surface-container-high/60 flex flex-col gap-space-md border border-outline-variant/20">
                    <div className="flex items-center gap-2 text-error font-title-md text-title-md font-bold">
                      <span className="material-symbols-outlined text-[22px]">cancel</span>
                      <span>Managing Diabetes Alone</span>
                    </div>
                    <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">remove</span>
                        <span>Reactive fingersticks or CGM alarms that only sound <em>after</em> severe lows occur.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">remove</span>
                        <span>Mental math errors calculating active insulin-on-board causing dangerous bolus stacking.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">remove</span>
                        <span>Fragmented paper logs and siloed hardware data unavailable to clinical endocrinologists.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">remove</span>
                        <span>Chronic nocturnal anxiety and disrupted sleep cycles from false or late alarms.</span>
                      </li>
                    </ul>
                  </div>

                  {/* The Sweety Workflow */}
                  <div className="p-space-md rounded-lg bg-secondary-container/20 flex flex-col gap-space-md border border-secondary-container/40">
                    <div className="flex items-center gap-2 text-primary font-title-md text-title-md font-bold">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>The Sweety Intelligent Workflow</span>
                    </div>
                    <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Predictive trajectory alerts 45 minutes before spikes or drops cross critical safety bounds.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Automated IOB decay curves, fat-protein meal digestion modeling, and precision ICR recommendations.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Real-time read portal and automated AGP reports seamlessly synchronized with doctor EHR charts.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check</span>
                        <span>Restful sleep backed by smart escalation protocols and remote family notification failsafes.</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Comprehensive 6-Row Feature Comparison Matrix Table */}
              <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/30">
                      <th className="py-3 px-4 font-label-md text-on-surface uppercase tracking-wider">Clinical Capability</th>
                      <th className="py-3 px-4 font-label-md text-on-surface-variant uppercase tracking-wider">Standard Basic Apps</th>
                      <th className="py-3 px-4 font-label-md text-primary uppercase tracking-wider font-bold">Sweety Intelligent Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-on-surface">CGM Sensor Auto-Pull</td>
                      <td className="py-3 px-4 text-on-surface-variant">Manual scans or delayed 3-hour batch sync</td>
                      <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Sub-second Dexcom &amp; Libre Realtime Streaming
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-on-surface">Ambulatory Glucose Profile (AGP)</td>
                      <td className="py-3 px-4 text-on-surface-variant">Basic line graph without consensus corridors</td>
                      <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Official ADA 2024 Standards (10–90th &amp; 25–75th bands)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-on-surface">Dawn Phenomenon Heuristic</td>
                      <td className="py-3 px-4 text-on-surface-variant">None (flags early spikes as generic highs)</td>
                      <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Automated 04:00–08:00 AM circadian diagnostic alert
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-on-surface">Nutrition &amp; Bolus Modeling</td>
                      <td className="py-3 px-4 text-on-surface-variant">Disconnected manual diary notes</td>
                      <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Integrated Rapid Bolus Calculator &amp; Zero Stacking IOB
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-on-surface">Doctor Attestation &amp; Export</td>
                      <td className="py-3 px-4 text-on-surface-variant">Raw CSV or manual screenshots</td>
                      <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Certified Clinician PDF + Epic/Cerner FHIR JSON
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-on-surface">Theme &amp; Visual Ergonomics</td>
                      <td className="py-3 px-4 text-on-surface-variant">Single generic light/dark mode</td>
                      <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        4 Clinical WCAG AAA Themes (Rose, Sage, Cerulean, Lilac)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </section>

          {/* =========================================================================
              SECTION 9: TESTIMONIALS & CLINICAL ENDORSEMENTS
              ========================================================================= */}
          <section id="testimonials" className="w-full bg-surface py-space-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              
              <div className="text-center max-w-2xl mx-auto mb-space-xl">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  Endorsed by Clinicians &amp; Patients
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                  Real Stories of Freedom &amp; Control
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                
                {/* Physician Testimonial */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-xs border border-outline-variant/30">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface italic mb-space-md leading-relaxed">
                      “Sweety gives my patients the clearest continuous picture of their glycemic variability without cognitive overload. When they come into my clinic with an exported AGP, our consultation is 10x more focused and productive.”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-space-xs border-t border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold font-title-md shadow-xs shrink-0">
                      RM
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-bold">Dr. Robert Miller, MD</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Board-Certified Endocrinologist, SF Endocrine Care</span>
                    </div>
                  </div>
                </div>

                {/* Patient Testimonial: Elena */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-xs border border-outline-variant/30">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface italic mb-space-md leading-relaxed">
                      “The predictive post-meal alerts and IOB tracking completely changed how I bolus for complex meals like pizza and sushi. My Time-in-Range went from 68% to 92% in my very first month using Sweety Pro.”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-space-xs border-t border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold font-title-md shadow-xs shrink-0">
                      EV
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-bold">Elena Vance</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Type 1 Diabetic (6 yrs), Marathoner</span>
                    </div>
                  </div>
                </div>

                {/* Caregiver Testimonial: Mark */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-xs border border-outline-variant/30">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface italic mb-space-md leading-relaxed">
                      “Nighttime alarms give my wife and me our sleep back. Knowing remote caregiver alerts are active and our 9-year-old son is safe from midnight crashes has lifted a massive weight off our family.”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-space-xs border-t border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold font-title-md shadow-xs shrink-0">
                      MD
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-bold">Mark D.</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Parent of pediatric T1D warrior (Age 9)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              SECTION 10: INTERACTIVE PRICING PREVIEW
              ========================================================================= */}
          <section id="pricing" className="w-full bg-surface-container-low/60 py-space-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              
              <div className="text-center max-w-2xl mx-auto mb-space-lg">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  Transparent &amp; Accessible
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                  Invest in Your Metabolic Freedom
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Start risk-free with our 14-day trial. HSA / FSA eligible expense under IRS Code 213(d).
                </p>

                {/* Billing Segmented Control (Monthly vs Annual -20%) */}
                <div className="inline-flex p-1 rounded-full bg-surface-container-high mt-space-md border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-full text-title-md font-semibold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'text-on-surface bg-surface-container-lowest shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-full text-title-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'text-on-surface bg-surface-container-lowest shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>Annual (Save 20%)</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-[10px] font-bold">
                      2 MONTHS FREE
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Tier Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md items-stretch">
                
                {/* Tier 1: Personal Starter */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Personal Starter
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                        Free Forever
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Basic manual logging and capillary fingerstick tracking for newly diagnosed or prediabetics.
                    </p>
                    <div className="flex items-baseline gap-1 mb-space-lg">
                      <span className="font-display text-[40px] font-extrabold text-on-surface tabular-nums">
                        $0
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        / month
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface mb-space-lg">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Manual fingerstick blood glucose logging</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Basic 7-day average glucose charts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Carb entry and meal notes journal</span>
                      </li>
                      <li className="flex items-center gap-2 text-on-surface-variant line-through opacity-60">
                        <span className="material-symbols-outlined text-[18px] opacity-40">close</span>
                        <span>Real-time CGM hardware streaming</span>
                      </li>
                      <li className="flex items-center gap-2 text-on-surface-variant line-through opacity-60">
                        <span className="material-symbols-outlined text-[18px] opacity-40">close</span>
                        <span>Predictive AGP &amp; nocturnal alerts</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="w-full h-10 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-md text-title-md flex items-center justify-center transition-colors border border-outline-variant/30 cursor-pointer"
                  >
                    Get Started Free
                  </button>
                </div>

                {/* Tier 2: Pro Telemetry (Highlighted Choice) */}
                <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-xl flex flex-col justify-between ring-2 ring-primary">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-extrabold shadow-md">
                    Most Popular Choice
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-space-xs mt-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Pro Telemetry
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-bold">
                        14-Day Trial
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Full continuous CGM cloud synchronization, predictive spike modeling, and advanced bolus math.
                    </p>
                    <div className="flex items-baseline gap-1 mb-space-lg">
                      <span className="font-display text-[44px] font-extrabold text-primary tabular-nums">
                        {billingCycle === 'monthly' ? '$9' : '$7'}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        {billingCycle === 'monthly' ? '/ month' : '/ month (billed $84/yr)'}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface mb-space-lg">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span><strong>Instant CGM sync</strong> (Dexcom, Libre, HealthKit)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span><strong>Predictive AGP</strong> modal day curves &amp; Dawn detection</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span>Active IOB decay calculator &amp; bolus wizard</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span>Critical multi-channel nocturnal hypo alerts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span>Unlimited clinical PDF &amp; CSV AGP export</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="w-full h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md flex items-center justify-center shadow-lg shadow-primary/25 transition-all cursor-pointer"
                  >
                    Start 14-Day Free Pro Trial
                  </button>
                </div>

                {/* Tier 3: Care Team Clinic */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Care Team Clinic
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                        Practices &amp; Families
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      For endocrinologists, diabetes educators (CDCES), and families needing multi-patient remote telemetry.
                    </p>
                    <div className="flex items-baseline gap-1 mb-space-lg">
                      <span className="font-display text-[40px] font-extrabold text-on-surface tabular-nums">
                        {billingCycle === 'monthly' ? '$29' : '$23'}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        {billingCycle === 'monthly' ? '/ month' : '/ month (billed $276/yr)'}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface mb-space-lg">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Everything in Pro Telemetry</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Multi-patient dashboard (up to 5 active profiles)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Automated emergency contact SMS routing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Direct EHR FHIR sync (Epic, Cerner integration)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                        <span>Signed HIPAA Business Associate Agreement (BAA)</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="w-full h-10 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-md text-title-md flex items-center justify-center transition-colors border border-outline-variant/30 cursor-pointer"
                  >
                    Contact Clinical Sales
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* =========================================================================
              SECTION 11: HIGH-CONVERSION BOTTOM CTA BANNER & 5-COLUMN FOOTER
              ========================================================================= */}
          <section className="w-full bg-surface py-space-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="relative rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary p-space-lg lg:p-space-xl overflow-hidden shadow-2xl text-on-primary">
                
                {/* Visual Glow Ambient Orbs */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
                <div className="absolute left-10 -top-20 w-60 h-60 rounded-full bg-surface-container-lowest/10 blur-xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-primary/15 text-on-primary font-label-sm text-label-sm mb-space-sm backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[16px]">format_image_left</span>
                    14-Day Free Access • No Credit Card Required
                  </span>
                  
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-display text-on-primary tracking-tight mb-space-sm leading-tight font-extrabold">
                    Take Control of Your Glycemic Health Today.
                  </h2>
                  
                  <p className="font-body-lg text-body-lg text-on-primary/90 mb-space-lg max-w-xl leading-relaxed">
                    Join 45,000+ individuals living with diabetes who sleep peacefully through the night, master complex postprandial meals, and achieve their target Time-in-Range.
                  </p>

                  <div className="flex flex-wrap items-center gap-space-md">
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="h-12 px-8 rounded-lg bg-surface-container-lowest hover:bg-surface-bright text-primary font-title-md text-title-md shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer font-bold"
                    >
                      <span>Get Started Free</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLaunch}
                      className="h-12 px-6 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-title-md text-title-md flex items-center justify-center transition-colors border border-on-primary/20 cursor-pointer"
                    >
                      Instant Demo Account
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-md mt-space-md pt-space-xs text-on-primary/80 font-body-sm text-body-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check</span> Instant Setup
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check</span> Cancel Anytime
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check</span> HIPAA Secure
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>

      {/* =========================================================================
          5-COLUMN CLINICAL & HIPAA COMPLIANCE FOOTER
          ========================================================================= */}
      <footer className="w-full bg-surface-container-low text-on-surface-variant shadow-[0_-1px_6px_rgba(173,39,55,0.03)] border-t border-outline-variant/30">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-space-xl pb-space-lg">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-xl">
            
            {/* Columns 1 & 2: Brand Mark, Summary & Compliance Chips */}
            <div className="lg:col-span-2 flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">vital_signs</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">
                  Sweety
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-space-xs leading-relaxed">
                Next-generation continuous glucose monitoring, real-time telemetry streaming, and proactive metabolic intelligence for individuals and clinical care teams.
              </p>
              <div className="flex flex-wrap items-center gap-space-xs mt-space-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[15px]">verified_user</span>
                  HIPAA Compliant
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[15px]">health_and_safety</span>
                  FDA Class II Cleared Telemetry
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[15px]">lock</span>
                  SOC2 Type II
                </span>
              </div>
              {/* System Status Indicator */}
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span>All Telemetry Systems Operational (99.98% Uptime)</span>
              </div>
            </div>

            {/* Column 3: Platform */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Platform
              </span>
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Continuous CGM Sync
              </a>
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Predictive Spikes &amp; Drops
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Biomarker Insights
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Hardware Integrations
              </a>
            </div>

            {/* Column 4: Clinical & Enterprise */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Clinical &amp; Enterprise
              </span>
              <a
                href="#clinical-solutions"
                onClick={(e) => scrollToSection(e, 'clinical-solutions')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Remote Patient Monitoring
              </a>
              <a
                href="#clinical-solutions"
                onClick={(e) => scrollToSection(e, 'clinical-solutions')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                EHR / Epic / Cerner Sync
              </a>
              <a
                href="#security-hipaa"
                onClick={(e) => scrollToSection(e, 'security-hipaa')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                BAA &amp; Security Protocols
              </a>
              <a
                href="#clinical-solutions"
                onClick={(e) => scrollToSection(e, 'clinical-solutions')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Provider Portal
              </a>
            </div>

            {/* Column 5: Trust & Legal */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                Trust &amp; Legal
              </span>
              <a
                href="#security-hipaa"
                onClick={(e) => scrollToSection(e, 'security-hipaa')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Security &amp; HIPAA
              </a>
              <a
                href="#security-hipaa"
                onClick={(e) => scrollToSection(e, 'security-hipaa')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Privacy Statement
              </a>
              <a
                href="#security-hipaa"
                onClick={(e) => scrollToSection(e, 'security-hipaa')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#security-hipaa"
                onClick={(e) => scrollToSection(e, 'security-hipaa')}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Medical Device Disclosure
              </a>
            </div>

          </div>

          {/* Bottom Legal Disclaimer & Copyright Notice */}
          <div className="pt-space-md border-t border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
            <p className="font-body-sm text-body-sm text-on-surface-variant/90 max-w-3xl leading-relaxed">
              Medical Disclaimer: Sweety is intended to support diabetes health management and continuous glucose telemetry analysis. It does not replace emergency medical diagnosis or direct guidance from licensed healthcare providers. Always consult your endocrinologist or primary physician before adjusting insulin or therapy regimens.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap tabular-nums">
              &copy; 2026 Sweety Health Technologies, Inc. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE PRODUCT TOUR MODAL (Live Telemetry Simulation)
          ========================================================================= */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                </div>
                <div>
                  <h3 className="font-title-md font-bold text-on-surface">Sweety Live Telemetry Simulation</h3>
                  <p className="text-xs text-on-surface-variant">2-Minute Clinical Tour &amp; CGM Synchronization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTourModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Dexcom G7 Streaming (Channel 04)
                  </span>
                  <span className="tabular-nums font-mono">1.2s avg latency</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-on-surface">
                  <span>Current Glycemic Reading:</span>
                  <span className="text-2xl text-primary tabular-nums font-bold">118 mg/dL</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  Sweety continuously streams 288 checkpoints per day directly from your continuous glucose monitor into your encrypted HIPAA vault.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant block font-medium">Predictive Horizon</span>
                  <span className="text-base font-bold text-primary tabular-nums">45 min</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant block font-medium">Time-in-Range (TIR)</span>
                  <span className="text-base font-bold text-tertiary tabular-nums">94%</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs text-on-surface-variant block font-medium">Active Insulin (IOB)</span>
                  <span className="text-base font-bold text-secondary tabular-nums">0.85 U</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setTourModalOpen(false)}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-semibold text-sm transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setTourModalOpen(false);
                  handleLaunch?.();
                }}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Enter App with Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
