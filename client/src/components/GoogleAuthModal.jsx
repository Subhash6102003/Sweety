import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Check, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export const GoogleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { googleLogin } = useAuth();
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleSubmit = async (e) => {
    e?.preventDefault();
    if (!googleEmail.trim()) {
      setError('Please enter your Google account email.');
      return;
    }

    const email = googleEmail.trim();
    const name = googleName.trim() || email.split('@')[0];
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ad2737&color=fff&size=128`;

    setError('');
    setLoading(true);

    try {
      await googleLogin(email, name, avatar);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Google sign in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header with Google Brand */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 bg-surface-container-lowest">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <h3 className="font-display font-extrabold text-base text-gray-900">
              Sign in with Google
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Enter your Google Workspace or personal Gmail address to sign in with your real identity. A genuine patient session will be created for you.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGoogleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-800" htmlFor="googleEmailInput">
                Google Email Address
              </label>
              <input
                id="googleEmailInput"
                type="email"
                required
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="name@gmail.com or company.io"
                className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-800" htmlFor="googleNameInput">
                Your Full Name (Optional)
              </label>
              <input
                id="googleNameInput"
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="e.g. Subhash Maurya"
                className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating with Google...</span>
              ) : (
                <>
                  <span>Continue to Sweety Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Cloud Info Pill */}
          <div className="pt-2 border-t border-gray-100 flex items-start gap-2 text-[11px] text-gray-500">
            <Shield className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>To connect full OAuth One Tap redirection in production, set <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-[10px]">VITE_GOOGLE_CLIENT_ID</code> in <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-[10px]">.env</code>.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
