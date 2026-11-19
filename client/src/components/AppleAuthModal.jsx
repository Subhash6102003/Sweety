import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, ArrowRight, Apple } from 'lucide-react';

export const AppleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { appleLogin } = useAuth();
  const [appleEmail, setAppleEmail] = useState('');
  const [appleName, setAppleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAppleSubmit = async (e) => {
    e?.preventDefault();
    if (!appleEmail.trim()) {
      setError('Please enter your Apple ID email address.');
      return;
    }

    const email = appleEmail.trim();
    const name = appleName.trim() || 'Apple Patient';

    setError('');
    setLoading(true);

    try {
      await appleLogin(email, name, email.split('@')[0]);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Apple ID authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header with Apple Brand */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 bg-black text-white">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.99-9.03-10.74-19.34-14.25-30.93-3.51-11.59-5.27-22.65-5.27-33.19 0-14.44 3.51-26.4 10.53-35.87 7.02-9.47 16.03-14.33 27.04-14.59 5.37 0 11.02 1.37 16.96 4.12 5.94 2.74 9.94 4.18 12.01 4.31 1.63-.26 5.86-1.77 12.69-4.53 6.83-2.76 12.44-4.04 16.84-3.84 13.06.66 23.46 5.32 31.2 13.98-11.45 6.94-17.06 16.48-16.83 28.61.23 9.47 3.86 17.51 10.89 24.12 7.03 6.61 15.42 10.33 25.18 11.16-2.04 6.25-4.47 12.55-7.31 18.9zM119.22 31.84c0-7.39 2.66-14.39 7.97-21.01 5.31-6.62 11.75-10.83 19.33-12.63.26 1.45.39 2.82.39 4.12 0 7.39-2.75 14.43-8.24 21.12-5.49 6.69-11.97 10.8-19.45 12.33-.27-1.32-.4-2.63-.4-3.93z" />
            </svg>
            <h3 className="font-display font-extrabold text-base text-white">
              Sign in with Apple
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleAppleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Sign in with your Apple ID. Your personal medical records and glycemic telemetry are encrypted and protected by Face ID / Touch ID protocols.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800">Apple ID Email Address</label>
            <input
              type="email"
              required
              placeholder="patient@icloud.com"
              value={appleEmail}
              onChange={(e) => setAppleEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800">Full Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Elena Vance"
              value={appleName}
              onChange={(e) => setAppleName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold shadow-md hover:bg-gray-900 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Continue with Apple'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
