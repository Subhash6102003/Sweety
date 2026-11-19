import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ReadingHistory } from './pages/ReadingHistory';
import { ReportsPage } from './pages/ReportsPage';
import { TrendsPage } from './pages/TrendsPage';
import { DailyJournalPage } from './pages/DailyJournalPage';
import { MedicationPage } from './pages/MedicationPage';
import { MealsNutritionPage } from './pages/MealsNutritionPage';
import { ActivityFitnessPage } from './pages/ActivityFitnessPage';
import { RemindersPage } from './pages/RemindersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthModal } from './components/AuthModal';
import { QuickLogModal } from './components/QuickLogModal';
import { api } from './api/client';

const AppContent = () => {
  const { isAuthenticated, login, logout } = useAuth();
  
  // High-level application mode: 'landing' | 'signin' | 'register' | 'app'
  const [appMode, setAppMode] = useState(() => {
    // If user already authenticated, default to app, else landing
    return localStorage.getItem('sweety_token') ? 'app' : 'landing';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Transition from landing page directly to demo account
  const handleGetStartedOrDemo = async () => {
    try {
      if (!isAuthenticated) {
        await login('demo@sweety.app', 'Password123!');
      }
      setAppMode('app');
      setActiveTab('dashboard');
    } catch (err) {
      setAppMode('signin');
    }
  };

  const handleSaveReading = async (data) => {
    try {
      await api.post('/api/readings', data);
      setLogModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Failed to save reading');
    }
  };

  // 1. Landing Page
  if (appMode === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAppMode('register')}
        onSignIn={() => setAppMode('signin')}
        onRegister={() => setAppMode('register')}
        onLaunchApp={handleGetStartedOrDemo}
      />
    );
  }

  // 2. Sign In Split/Bento Page matching Stitch specification
  if (appMode === 'signin') {
    return (
      <SignIn
        onNavigate={(targetMode) => setAppMode(targetMode)}
        onSuccess={() => {
          setAppMode('app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // 3. Register Account Split/Bento Page matching Stitch specification
  if (appMode === 'register') {
    return (
      <Register
        onNavigate={(targetMode) => setAppMode(targetMode)}
        onSuccess={() => {
          setAppMode('app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // 4. App Shell: Persistent w-72 Sidebar + Top Telemetry Header + Dynamic Page Content
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased transition-colors duration-200">
      
      {/* 1. Permanent Desktop Sidebar matching Stitch Image 3 */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          if (tabId === 'log') {
            setLogModalOpen(true);
          } else {
            setActiveTab(tabId);
          }
        }}
      />

      {/* 2. Main Canvas Shell: Fixed Desktop left offset w-72 */}
      <div className="min-h-screen flex flex-col pl-72">
        {/* Fixed Top Telemetry Header */}
        <TopHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onOpenLogModal={() => setLogModalOpen(true)}
          onLogout={() => setAppMode('landing')}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 pt-20 px-8 pb-12 w-full bg-surface">
          {activeTab === 'dashboard' && (
            <Dashboard
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          )}

          {activeTab === 'history' && (
            <ReadingHistory
              onOpenEditModal={(r) => {
                setLogModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reports' && <ReportsPage />}

          {activeTab === 'trends' && <TrendsPage />}

          {activeTab === 'journal' && (
            <DailyJournalPage onOpenLogModal={() => setLogModalOpen(true)} />
          )}

          {activeTab === 'medication' && <MedicationPage />}

          {activeTab === 'nutrition' && <MealsNutritionPage />}

          {activeTab === 'activity' && <ActivityFitnessPage />}

          {activeTab === 'reminders' && <RemindersPage />}

          {activeTab === 'profile' && <ProfilePage />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>

        {/* Global Clinical Telemetry Footer */}
        <footer className="py-6 px-8 border-t border-outline-variant/20 text-xs text-outline flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sweety &copy; 2026. Clinical Blood Glucose Tracker.</span>
          <span className="font-semibold text-primary">Warm Clinical Health &bull; Rose Red System</span>
        </footer>

      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setAppMode('app');
        }}
      />

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSave={handleSaveReading}
        defaultDate={selectedDate}
        existingSlotsForDate={[]}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
