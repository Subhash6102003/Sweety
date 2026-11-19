import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, Check, Palette, Sparkles } from 'lucide-react';

/**
 * Reusable ThemeSelector Component
 * Supports switching across the 4 official Stitch Clinical Themes:
 * - Warm Clinical Health (Default Primary, 'rose')
 * - Clinical Sage Health ('green')
 * - Clinical Cerulean ('blue')
 * - Clinical Lilac Health ('purple')
 *
 * Implements accessible keyboard navigation, ARIA attributes,
 * and snappy 150-220ms micro-interactions.
 */
export const ThemeSelector = ({
  variant = 'dropdown',
  align = 'right',
  showLabel = true,
  className = ''
}) => {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);

  const activeTheme = themes.find((t) => t.id === currentTheme) || themes[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation & accessibility
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = themes.findIndex((t) => t.id === currentTheme);
      const nextIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % themes.length
        : (currentIndex - 1 + themes.length) % themes.length;
      changeTheme(themes[nextIndex].id);
    }
  }, [isOpen, themes, currentTheme, changeTheme]);

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 gap-1 ${className}`}
        role="radiogroup"
        aria-label="Clinical Theme Selector"
      >
        {themes.map((theme) => {
          const isSelected = theme.id === currentTheme;
          return (
            <button
              key={theme.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => changeTheme(theme.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
              }`}
              title={theme.name}
            >
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 shrink-0"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="font-display">{theme.badge || theme.name.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Elegant Dropdown Pill
  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current theme: ${activeTheme.name}. Click to change theme.`}
        className="group flex items-center space-x-2 h-9 px-3.5 rounded-full border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-semibold text-on-surface transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95 whitespace-nowrap shrink-0"
      >
        <span
          className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 shadow-xs shrink-0 transition-transform duration-150 group-hover:scale-110"
          style={{ backgroundColor: activeTheme.primary }}
          aria-hidden="true"
        />
        {showLabel && (
          <span className="font-display text-on-surface font-semibold tracking-tight text-xs whitespace-nowrap">
            {activeTheme.name}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-outline transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : 'group-hover:text-on-surface'
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          aria-label="Select Clinical Theme"
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-64 rounded-2xl bg-white border border-outline-variant/60 shadow-2xl py-2 z-[999] animate-in fade-in zoom-in-95 duration-150 focus:outline-none`}
          style={{ backgroundColor: '#ffffff', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)' }}
        >
          {/* Header */}
          <div className="px-3.5 py-1.5 flex items-center justify-between border-b border-outline-variant/20 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-primary" />
              <span>Clinical Themes</span>
            </span>
            <span className="text-[10px] font-semibold text-outline-variant">
              4 Variants
            </span>
          </div>

          {/* Theme List */}
          <div className="px-1.5 space-y-0.5">
            {themes.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    changeTheme(theme.id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 ${
                    isSelected
                      ? 'bg-surface-container text-primary font-bold shadow-xs'
                      : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-1 ring-black/15 shadow-xs shrink-0"
                      style={{ backgroundColor: theme.primary }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-display text-xs truncate">
                        {theme.name}
                      </span>
                      {theme.description && (
                        <span className="text-[10px] font-normal text-outline truncate leading-tight">
                          {theme.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    {theme.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {theme.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clinical Guideline Hint */}
          <div className="mt-2 pt-1.5 px-3 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-outline">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              ADA 2024 Corridors
            </span>
            <span className="font-mono text-[9px] uppercase">{currentTheme}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
