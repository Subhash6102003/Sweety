import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../api/client';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  if (!isOpen) return null;

  const handleDemoFill = () => {
    setIsLogin(true);
    setEmail('demo@sweety.app');
    setPassword('Password123!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? getApiUrl('/api/auth/login') : getApiUrl('/api/auth/register');
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-display font-bold text-xl text-gray-900">
              {isLogin ? 'Welcome Back to Sweety' : 'Create Patient Account'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLogin ? 'Enter your details to view your glucose journal' : 'Join Sweety to manage your daily readings'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Account Banner */}
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-theme-primary-light border border-theme-primary-border text-theme-primary hover:opacity-90 transition-all text-xs font-semibold"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Use Demo Account (demo@sweety.app)</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider underline">
              Autofill
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-sm font-semibold text-gray-900 transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="patient@sweety.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-sm font-semibold text-gray-900 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-sm font-semibold text-gray-900 transition-all"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-sm font-bold shadow-md shadow-theme-primary/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In to Sweety' : 'Create Free Account'}
            </button>
          </div>

          {/* Toggle Login / Register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs font-semibold text-gray-500 hover:text-theme-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
