import { useState, useCallback, useEffect } from 'react';
import { KeyStatus } from '../types';
import { checkApiKeyHealth } from '../services/geminiService';

const ADMIN_PASSWORD = 'Skidmin2025'; // Admin password for local admin view

interface AuthState {
  apiKey: string | null;
  isAdmin: boolean;
  terminalPassword: string | null;
  isActivated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    apiKey: localStorage.getItem('gemini_api_key'),
    isAdmin: sessionStorage.getItem('is_admin') === 'true',
    terminalPassword: localStorage.getItem('terminal_password'),
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
        // This case usually means the key is invalid or permissions are wrong
        setKeyStatus('invalid');
      }
    } catch (e: any) {
        // This could be a network error or a rate limit error
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

  const login = useCallback((key: string, password?: string, isAdminLogin?: boolean) => {
    if (isAdminLogin && password === ADMIN_PASSWORD) {
      // Admin login flow
      localStorage.setItem('gemini_api_key', key);
      sessionStorage.setItem('is_admin', 'true');
      localStorage.setItem('is_activated', 'true');
      setAuthState(prev => ({
        ...prev,
        apiKey: key,
        isAdmin: true,
        isActivated: true
      }));
    } else if (authState.isActivated && password === authState.terminalPassword) {
      // Teacher login flow
      setAuthState(prev => ({
        ...prev,
        isAdmin: false
      }));
    }
  }, [authState.isActivated, authState.terminalPassword]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('is_admin');
    setAuthState(prev => ({
      ...prev,
      isAdmin: false
    }));
  }, []);

  const setTerminalPassword = useCallback((password: string) => {
    localStorage.setItem('terminal_password', password);
    setAuthState(prev => ({
      ...prev,
      terminalPassword: password
    }));
  }, []);
  
  const recheckKeyHealth = useCallback(() => {
    verifyAndSetKeyStatus(authState.apiKey);
  }, [authState.apiKey, verifyAndSetKeyStatus]);


  return { 
  authState,
  keyStatus, 
  login, 
  logout, 
  recheckKeyHealth,
  setTerminalPassword
};
};