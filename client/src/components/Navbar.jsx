import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Palette, LogOut, User, Activity, ChevronDown } from 'lucide-react';

export const Navbar = ({ selectedDate, onDateChange, onOpenAuth }) => {
  const { currentTheme, changeTheme, themes } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const activeThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-theme-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-md shadow-theme-primary/20 transition-all duration-300">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-gray-900">
                Sweety
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-theme-primary-light text-theme-primary border border-theme-border">
                Glucose Tracker
              </span>
            </div>
          </div>

          {/* Center Date Picker (When authenticated) */}
          {isAuthenticated && (
            <div className="flex items-center space-x-2 bg-gray-50 border border-theme-border rounded-xl px-3 py-1.5 shadow-2xs">
              <Calendar className="w-4 h-4 text-theme-primary" />
              <span className="text-xs font-medium text-gray-500 hidden md:inline">Date:</span>
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-hidden cursor-pointer"
              />
            </div>
          )}

          {/* Right Controls: Theme Selector + User */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-theme-border bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-2xs"
                title="Change Design Theme"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: activeThemeObj.color }}
                />
                <span className="hidden sm:inline">{activeThemeObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {themeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setThemeDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Choose Theme
                    </div>
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          changeTheme(theme.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-gray-50 transition-colors ${
                          currentTheme === theme.id ? 'bg-theme-primary-light font-bold text-theme-primary' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: theme.color }}
                          />
                          <span>{theme.name}</span>
                        </div>
                        {theme.id === 'rose' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold">
                            Primary
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-theme-border">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-900">{user?.name}</span>
                  <span className="text-[10px] text-gray-500 truncate max-w-[130px]">{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold shadow-md shadow-theme-primary/25 transition-all"
              >
                Sign In / Register
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
