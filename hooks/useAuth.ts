import { useState, useCallback, useEffect } from 'react';
import { KeyStatus } from '../types';
import { checkApiKeyHealth } from '../services/geminiService';

const ADMIN_PASSWORD = 'Skidmin2025'; // Admin password for local admin view

export const useAuth = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini_api_key'));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => sessionStorage.getItem('is_admin') === 'true');
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
    verifyAndSetKeyStatus(apiKey);
  }, [apiKey, verifyAndSetKeyStatus]);

  const login = useCallback((key: string, adminPass?: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    if (adminPass === ADMIN_PASSWORD) {
        sessionStorage.setItem('is_admin', 'true');
        setIsAdmin(true);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gemini_api_key');
    sessionStorage.removeItem('is_admin');
    setApiKey(null);
    setIsAdmin(false);
  }, []);
  
  const recheckKeyHealth = useCallback(() => {
    verifyAndSetKeyStatus(apiKey);
  }, [apiKey, verifyAndSetKeyStatus]);


  return { apiKey, isAdmin, keyStatus, login, logout, recheckKeyHealth };
};