import React from 'react';
import {
  LayoutDashboard,
  Droplet,
  History,
  BarChart3,
  TrendingUp,
  BookOpen,
  Pill,
  Utensils,
  Activity,
  Bell,
  User,
  Settings,
  HelpCircle,
  MessageSquare,
  Search,
  X
} from 'lucide-react';

export const Sidebar = ({ 
  activeTab = 'dashboard', 
  onSelectTab = () => {}
}) => {
  // 12 Clinical Navigation Items across 3 Sections matching Stitch specifications exactly
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Log Glucose', icon: Droplet },
    { id: 'history', label: 'Reading History', icon: History },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'trends', label: 'Trends & Insights', icon: TrendingUp },
    { id: 'journal', label: 'Daily Journal', icon: BookOpen, badge: '3' },
  ];

  const careNav = [
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'nutrition', label: 'Meals & Nutrition', icon: Utensils },
    { id: 'activity', label: 'Activity & Fitness', icon: Activity },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: '2' },
  ];

  const prefNav = [
    { id: 'profile', label: 'My Health Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between overflow-y-auto">
      <div className="p-space-lg">
        
        {/* Brand Header */}
        <div className="flex items-center gap-space-sm mb-space-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            Sweety
          </span>
        </div>

          {/* Search Bar */}
          <div className="relative mb-space-lg">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-space-md py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* 1. Main Menu (6 items) */}
          <div className="space-y-space-md">
            <div className="space-y-1">
              <p className="px-space-sm font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline mb-1">
                Main Menu
              </p>
              <nav className="space-y-0.5">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-space-sm py-2 rounded-full font-label-lg text-label-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* 2. Care & Health (4 items) */}
            <div className="space-y-1">
              <p className="px-space-sm font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline mb-1">
                Care &amp; Health
              </p>
              <nav className="space-y-0.5">
                {careNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-space-sm py-2 rounded-full font-label-lg text-label-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* 3. Preferences (2 items) */}
            <div className="space-y-1">
              <p className="px-space-sm font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline mb-1">
                Preferences
              </p>
              <nav className="space-y-0.5">
                {prefNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={item.id === 'profile' ? 'tour-nav-profile' : undefined}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center px-space-sm py-2 rounded-full font-label-lg text-label-lg transition-colors gap-space-sm cursor-pointer ${
                        isActive
                          ? 'bg-surface-container text-primary font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

        </div>

        {/* Sidebar Footer: Support & Active Dexcom G7 Synced Indicator */}
        <div className="p-space-lg pt-0 space-y-space-md">
          <div className="space-y-0.5 border-t border-outline-variant/30 pt-space-sm">
            <button
              type="button"
              className="w-full flex items-center gap-space-sm px-space-sm py-1.5 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-space-sm px-space-sm py-1.5 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedback</span>
            </button>
          </div>

          {/* Active Dexcom G7 sync indicator with pulsing dot */}
          <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/50">
            <div className="flex items-center gap-space-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                Dexcom G7 Synced
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-outline">
              Sensor: 10d left • 98% active
            </p>
          </div>
        </div>

      </aside>
  );
};
