import { useState, useCallback, useEffect } from 'react';
import { KeyStatus } from '../types';
import { checkApiKeyHealth } from '../services/geminiService';

const ADMIN_PASSWORD = 'Skidmin2025'; // Admin password for local admin view

interface AuthState {
  apiKey: string | null;
  isAdmin: boolean;
  terminalPassword: string | null;
  terminalName: string | null;
  isActivated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    apiKey: localStorage.getItem('gemini_api_key'),
    isAdmin: sessionStorage.getItem('is_admin') === 'true',
    terminalPassword: localStorage.getItem('terminal_password'),
    terminalName: localStorage.getItem('terminal_name'),
    isActivated: localStorage.getItem('is_activated') === 'true'
  }));
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('checking');

  const verifyAndSetKeyStatus = useCallback(async (key: string | null) => {
    if (!key) {
      setKeyStatus('invalid');
      return;
    }
    setKeyStatus('checking');
    try {
      const isHealthy = await checkApiKeyHealth(key);
      if (isHealthy) {
        setKeyStatus('healthy');
      } else {
        setKeyStatus('invalid');
      }
    } catch (e: any) {
        if (e.message.includes('429')) {
             setKeyStatus('throttled');
        } else {
            setKeyStatus('error');
        }
    }
  }, []);
  
  useEffect(() => {
    verifyAndSetKeyStatus(authState.apiKey);
  }, [authState.apiKey, verifyAndSetKeyStatus]);

  const adminSetup = useCallback((key: string, password: string, terminalName: string, terminalPassword: string) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('gemini_api_key', key);
      localStorage.setItem('terminal_password', terminalPassword);
      localStorage.setItem('terminal_name', terminalName);
      localStorage.setItem('is_activated', 'true');
      sessionStorage.setItem('is_admin', 'true');
      setAuthState({
        apiKey: key,
        isAdmin: true,
        terminalPassword: terminalPassword,
        terminalName: terminalName,
        isActivated: true
      });
      return true;
    }
    return false;
  }, []);

  const teacherLogin = useCallback((password: string) => {
    if (authState.isActivated && password === authState.terminalPassword) {
      sessionStorage.removeItem('is_admin');
      setAuthState(prev => ({
        ...prev,
        isAdmin: false
      }));
      return true;
    }
    return false;
  }, [authState.isActivated, authState.terminalPassword]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('is_admin');
    setAuthState(prev => ({
      ...prev,
      isAdmin: false
    }));
  }, []);
  
  const recheckKeyHealth = useCallback(() => {
    verifyAndSetKeyStatus(authState.apiKey);
  }, [authState.apiKey, verifyAndSetKeyStatus]);

  // Reset system (for development/testing - remove in production)
  const resetSystem = useCallback(() => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('terminal_password');
    localStorage.removeItem('terminal_name');
    localStorage.removeItem('is_activated');
    sessionStorage.removeItem('is_admin');
    setAuthState({
      apiKey: null,
      isAdmin: false,
      terminalPassword: null,
      terminalName: null,
      isActivated: false
    });
  }, []);

  return { 
    authState,
    keyStatus, 
    adminSetup,
    teacherLogin,
    logout, 
    recheckKeyHealth,
    resetSystem
  };
};