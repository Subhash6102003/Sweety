import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES } from '../data/countries';
import { ChevronDown, Search, Check } from 'lucide-react';

export const InternationalPhoneInput = ({
  value = '',
  onChange = () => {},
  className = ''
}) => {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Default to US or detect from initial value
    return COUNTRIES[0];
  });
  const [localNumber, setLocalNumber] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Parse incoming value if provided
  useEffect(() => {
    if (!value) return;
    const matched = COUNTRIES.find(c => value.startsWith(c.dial));
    if (matched) {
      setSelectedCountry(matched);
      const rest = value.slice(matched.dial.length).trim();
      setLocalNumber(rest);
    } else {
      setLocalNumber(value);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearchQuery('');
    const full = `${country.dial} ${localNumber}`.trim();
    onChange(full, { country: country.code, dialCode: country.dial, localNumber });
  };

  const handleNumberChange = (e) => {
    // Allow digits, spaces, hyphens
    const cleaned = e.target.value.replace(/[^\d\s-]/g, '');
    setLocalNumber(cleaned);
    const full = `${selectedCountry.dial} ${cleaned}`.trim();
    onChange(full, { country: selectedCountry.code, dialCode: selectedCountry.dial, localNumber: cleaned });
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dial.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative flex items-center ${className}`} ref={dropdownRef}>
      
      {/* Country Flag Trigger Button & Dial Code Badge */}
      <div className="flex items-center h-10 bg-surface-container-low rounded-l-xl border border-r-0 border-outline-variant/40 hover:bg-surface-container transition-colors shrink-0">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 h-full px-2.5 rounded-l-xl focus:outline-none cursor-pointer"
          title={`${selectedCountry.name} (${selectedCountry.dial}) - Click to change country`}
        >
          {/* Country Flag strictly displayed */}
          <span className="text-lg leading-none select-none" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-outline" />
        </button>

        {/* Dial Code Prefix clearly visible beside the flag */}
        <span className="pr-2.5 pl-1 text-xs font-bold text-on-surface select-none border-r border-outline-variant/30">
          {selectedCountry.dial}
        </span>
      </div>

      {/* Local Phone Number Input */}
      <input
        type="tel"
        value={localNumber}
        onChange={handleNumberChange}
        placeholder={selectedCountry.placeholder || `${selectedCountry.digits} digits`}
        className="flex-1 h-10 px-3 rounded-r-xl bg-surface-container-low text-on-surface text-xs font-semibold placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/40"
      />

      {/* Country Picker Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-11 left-0 w-72 max-h-64 bg-white rounded-2xl shadow-2xl border border-outline-variant/40 py-2 z-[999] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          
          {/* Search bar inside dropdown */}
          <div className="px-3 pb-2 border-b border-outline-variant/20">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-outline absolute left-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* List of Countries */}
          <div className="overflow-y-auto flex-1 divide-y divide-outline-variant/10 px-1">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-xs text-outline font-medium">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base select-none shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[11px] font-bold text-outline tabular-nums">{c.dial}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
};
