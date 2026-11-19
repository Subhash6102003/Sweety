import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeSelector } from '../ThemeSelector';
import {
  Home,
  Calendar,
  ChevronDown,
  Plus,
  LogOut
} from 'lucide-react';

export const TopHeader = ({ selectedDate, onDateChange, onOpenLogModal, onLogout }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const formattedDateString = (() => {
    try {
      if (!selectedDate) return 'Today, Oct 24, 2024';
      const d = new Date(selectedDate);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Today, Oct 24, 2024';
    }
  })();

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-bright/95 backdrop-blur-md border-b border-outline-variant/30 z-40 px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      
      {/* Left: Clean Clinical Breadcrumb & Date Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs font-medium text-outline">
          <Home className="w-3.5 h-3.5 text-outline" />
          <span>/</span>
          <span className="text-on-surface font-semibold">Sweety Telemetry</span>
          <span>/</span>
          <span className="text-outline">Live Corridor</span>
        </div>

        <div className="h-4 w-[1px] bg-outline-variant/50 hidden sm:block" />

        {/* Date Selector Pill */}
        <div className="relative hidden sm:flex items-center">
          <label className="flex items-center space-x-2 h-9 px-3.5 bg-surface-container-lowest rounded-full border border-outline-variant/40 text-xs font-semibold text-on-surface shadow-xs hover:bg-surface-container-low transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{formattedDateString}</span>
            <ChevronDown className="w-3.5 h-3.5 text-outline" />
            <input
              type="date"
              value={selectedDate || ''}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => onDateChange && onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Right: Theme Switcher, Profile, Sign Out, Log Glucose */}
      <div className="flex items-center space-x-3.5">
        
        {/* 4-Theme Clinical Token Switcher */}
        <ThemeSelector align="right" />

        <div className="h-5 w-[1px] bg-outline-variant/50 hidden md:block" />

        {/* Patient Profile Chip */}
        <div className="flex items-center space-x-2.5">
          {user?.avatarUrl ? (
            <img
              alt={`${user?.name || 'User'} Profile`}
              className="w-9 h-9 rounded-full object-cover border border-outline-variant/50 ring-2 ring-primary/20 shrink-0"
              src={user.avatarUrl}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              <span>{user?.name ? user.name.slice(0, 2).toUpperCase() : 'EV'}</span>
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="font-display text-xs font-bold text-on-surface leading-tight">
              {user?.name || 'Elena Vance'}
            </p>
            <p className="text-[11px] text-outline leading-tight">
              {user?.diagnosis || 'Type 1 Diabetes'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out to Landing Page"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Quick Log Action Button */}
        <button
          type="button"
          onClick={onOpenLogModal}
          className="flex items-center space-x-1.5 h-9 px-4 bg-primary text-on-primary rounded-lg text-xs font-bold shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Log Glucose</span>
        </button>

      </div>

    </header>
  );
};

export default TopHeader;
