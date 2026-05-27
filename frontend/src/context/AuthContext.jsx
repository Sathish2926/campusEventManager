import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);
const AUTH_KEY = 'campus_event_manager_auth';
const TOKEN_KEY = 'campus_event_manager_token';
const THEME_KEY = 'campus_event_manager_theme';

const getStoredAuth = () => {
  const rawValue = localStorage.getItem(AUTH_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

const getStoredTheme = () => localStorage.getItem(THEME_KEY) === 'dark';
const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredAuth);
  const [token, setToken] = useState(getStoredToken);
  const [darkMode, setDarkMode] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setToken('');
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = async ({ email, password }) => {
    const payload = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setUser(payload.user);
    setToken(payload.token);
    return payload.user;
  };

  const signup = async ({ name, email, password, role, department, year, adminCode }) => {
    const payload = await apiRequest('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, department, year, adminCode }),
    });

    setUser(payload.user);
    setToken(payload.token);
    return payload.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const updateProfile = (updates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = {
        ...currentUser,
        ...updates,
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      updateProfile,
      darkMode,
      setDarkMode,
      toggleDarkMode: () => setDarkMode((currentValue) => !currentValue),
    }),
    [darkMode, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};