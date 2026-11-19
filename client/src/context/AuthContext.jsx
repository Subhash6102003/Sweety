import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sweety_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sweety_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify session with /api/auth/me
    if (token) {
      fetch(getApiUrl('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          // Merge server data with saved client details (e.g., avatar, phone, clinical params)
          setUser(prev => {
            const merged = { ...prev, ...data.user };
            localStorage.setItem('sweety_user', JSON.stringify(merged));
            return merged;
          });
        })
        .catch(() => {
          // If offline or dev mode, keep local user if available, otherwise logout
          if (!localStorage.getItem('sweety_user')) {
            logout();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  /**
   * Dual-mode login:
   * 1. login(email, password) -> triggers API call
   * 2. login(userData, token) -> sets credentials directly
   */
  const login = async (arg1, arg2) => {
    if (typeof arg1 === 'string' && typeof arg2 === 'string') {
      const email = arg1;
      const password = arg2;
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      const existingSaved = localStorage.getItem('sweety_user');
      const savedObj = existingSaved ? JSON.parse(existingSaved) : {};
      const fullProfile = {
        ...data.user,
        ...savedObj,
        name: data.user.name || savedObj.name || 'Elena Vance',
        email: data.user.email || savedObj.email || email,
        avatarUrl: savedObj.avatarUrl || data.user.avatarUrl || ''
      };
      setUser(fullProfile);
      setToken(data.token);
      localStorage.setItem('sweety_user', JSON.stringify(fullProfile));
      localStorage.setItem('sweety_token', data.token);
      return data;
    } else {
      const userData = arg1;
      const authToken = arg2;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('sweety_user', JSON.stringify(userData));
      if (authToken) localStorage.setItem('sweety_token', authToken);
    }
  };

  /**
   * Register new user with real demographic data & avatar
   */
  const register = async (email, password, name, extraData = {}) => {
    const res = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, avatarUrl: extraData.avatarUrl })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    const fullProfile = {
      ...data.user,
      ...extraData,
      role: 'Patient',
      mrn: extraData.mrn || `MRN: ${Math.floor(100000 + Math.random() * 900000)}-T1`,
      diagnosis: extraData.diagnosis || 'Type 1 Diabetes',
      avatarUrl: extraData.avatarUrl || ''
    };
    setUser(fullProfile);
    setToken(data.token);
    localStorage.setItem('sweety_user', JSON.stringify(fullProfile));
    localStorage.setItem('sweety_token', data.token);
    return data;
  };

  /**
   * Google Workspace OAuth / Simulated Account Sign In
   */
  const googleLogin = async (email, name, avatarUrl) => {
    const res = await fetch(getApiUrl('/api/auth/google'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, avatarUrl })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google authentication failed');
    }
    const fullProfile = {
      ...data.user,
      role: 'Patient',
      diagnosis: 'Type 1 Diabetes',
      avatarUrl: avatarUrl || data.user.avatarUrl || ''
    };
    setUser(fullProfile);
    setToken(data.token);
    localStorage.setItem('sweety_user', JSON.stringify(fullProfile));
    localStorage.setItem('sweety_token', data.token);
    return data;
  };

  /**
   * Apple ID SSO Sign In
   */
  const appleLogin = async (email, name, appleUserId) => {
    const res = await fetch(getApiUrl('/api/auth/apple'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, appleUserId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Apple ID authentication failed');
    }
    const fullProfile = {
      ...data.user,
      role: 'Patient',
      diagnosis: 'Type 1 Diabetes',
      avatarUrl: data.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Apple Patient')}&background=000&color=fff`
    };
    setUser(fullProfile);
    setToken(data.token);
    localStorage.setItem('sweety_user', JSON.stringify(fullProfile));
    localStorage.setItem('sweety_token', data.token);
    return data;
  };

  /**
   * Request 6-digit magic code sent to email
   */
  const requestEmailCode = async (email) => {
    const res = await fetch(getApiUrl('/api/auth/email/request-code'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch email verification code');
    }
    return data;
  };

  /**
   * Login with 6-digit email code
   */
  const loginWithEmailCode = async (email, code) => {
    const res = await fetch(getApiUrl('/api/auth/email/verify-code'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to verify email code');
    }
    const fullProfile = {
      ...data.user,
      role: 'Patient',
      diagnosis: 'Type 1 Diabetes'
    };
    setUser(fullProfile);
    setToken(data.token);
    localStorage.setItem('sweety_user', JSON.stringify(fullProfile));
    localStorage.setItem('sweety_token', data.token);
    return data;
  };

  /**
   * Update active user profile details (avatar, name, metrics, etc.) and dispatch SMTP notice
   */
  const updateUser = async (updatedFields) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...updatedFields };
      localStorage.setItem('sweety_user', JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        await fetch(getApiUrl('/api/auth/profile'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedFields)
        });
      } catch (err) {
        console.warn('Profile update remote notice error:', err);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sweety_user');
    localStorage.removeItem('sweety_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      googleLogin,
      appleLogin,
      requestEmailCode,
      loginWithEmailCode,
      updateUser,
      logout,
      loading,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
