import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ArrowLeft, Check, X, Compass } from 'lucide-react';

const TOUR_STEPS = [
  {
    targetId: 'tour-checkpoints',
    title: '1. Today\'s 4 Milestone Checkpoints',
    description: 'Track your standard clinical windows: Morning Fasting, Post-Breakfast, Post-Lunch, and Post-Dinner. Click "+ Log Slot" on any unrecorded card to add your glucose reading.',
    position: 'bottom'
  },
  {
    targetId: 'tour-quick-log',
    title: '2. Rapid Telemetry Logging',
    description: 'Quickly record ad-hoc blood glucose readings, insulin boluses, or meals with one click. Everything is saved instantly to your private Supabase database.',
    position: 'top'
  },
  {
    targetId: 'tour-agp-chart',
    title: '3. Ambulatory Glucose Profile (AGP)',
    description: 'Your continuous glucose telemetry corridor is visualized here against clinical targets (70–140 mg/dL). Hover over points to inspect timestamps and excursion deltas.',
    position: 'top'
  },
  {
    targetId: 'tour-export-button',
    title: '4. Certified Clinical AGP Export',
    description: 'Generate certified PDF reports or download full CSV spreadsheets to review with your endocrinologist and medical care team.',
    position: 'bottom'
  },
  {
    targetId: 'tour-nav-profile',
    title: '5. Health Profile & Clinical Units',
    description: 'Visit "My Health Profile" in the sidebar to configure your diagnosis, select US Imperial (lbs/ft) or UK/Metric (kg/cm) standards, and update your personal clinical records.',
    position: 'right'
  }
];

export const OnboardingTour = () => {
  const { user } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const tourKey = `sweety_tour_completed_${user.id}`;
    const alreadyCompleted = localStorage.getItem(tourKey);

    // Only launch for users who have not completed the tour yet
    if (!alreadyCompleted) {
      // Small timeout to allow DOM elements to mount
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const currentStep = TOUR_STEPS[stepIndex];
    if (!currentStep) return;

    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
      el.classList.add('tour-highlighted-element');
    }

    return () => {
      if (el) el.classList.remove('tour-highlighted-element');
    };
  }, [stepIndex, isOpen]);

  const handleFinish = () => {
    if (user?.id) {
      localStorage.setItem(`sweety_tour_completed_${user.id}`, 'true');
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  };

  if (!isOpen || !user) return null;

  const currentStep = TOUR_STEPS[stepIndex];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none transition-all">
      {/* Semi-transparent dark overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-auto transition-opacity"
        onClick={handleFinish}
      />

      {/* Floating Tour Card */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92vw] max-w-lg z-50 pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-surface-container-lowest border-2 border-primary/40 rounded-2xl shadow-2xl p-5 text-on-surface ring-8 ring-primary/10">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <Compass className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Quick Feature Tour ({stepIndex + 1} of {TOUR_STEPS.length})
              </span>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container-high transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Skip Tour"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-2 mb-5">
            <h4 className="font-display font-extrabold text-base text-on-surface flex items-center gap-2">
              {currentStep.title}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Step Dots & Navigation Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === stepIndex ? 'w-5 bg-primary' : 'w-1.5 bg-outline-variant'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-on-surface text-xs font-bold hover:bg-surface-container-low transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{stepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                {stepIndex === TOUR_STEPS.length - 1 ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
