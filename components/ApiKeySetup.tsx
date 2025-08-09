
import React, { useState } from 'react';
import { SparklesIcon, ExclamationTriangleIcon, ClockIcon } from './icons';
import { KeyStatus } from '../types';
import { UsageGuide } from './UsageGuide';

interface ApiKeySetupProps {
  onApiKeySubmit: (key: string, password?: string, isAdminLogin?: boolean) => void;
  onTerminalPasswordSet: (password: string) => void;
  isActivated: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  onApiKeySubmit, 
  onTerminalPasswordSet,
  isActivated 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [password, setPassword] = useState('');
  const [terminalPassword, setTerminalPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(!isActivated);
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminLogin && apiKey.trim()) {
      onApiKeySubmit(apiKey.trim(), password.trim(), true);
      if (terminalPassword) {
        onTerminalPasswordSet(terminalPassword);
      }
    } else if (!isAdminLogin && password.trim()) {
      onApiKeySubmit('', password.trim(), false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-500 rounded-full p-4 mb-4">
            <SparklesIcon className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Code Buddy</h1>
          <p className="text-gray-600">Enter your Gemini API key to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your API key"
              required
            />
          </div>

          {isAdminLogin ? (
          <>
            <div>
              <label htmlFor="adminPass" className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
              <input
                id="adminPass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            <div>
              <label htmlFor="terminalPass" className="block text-sm font-medium text-gray-700 mb-1">Set Terminal Password</label>
              <input
                id="terminalPass"
                type="password"
                value={terminalPassword}
                onChange={(e) => setTerminalPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Create password for teachers"
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="teacherPass" className="block text-sm font-medium text-gray-700 mb-1">Terminal Password</label>
            <input
              id="teacherPass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter terminal password"
              required
            />
          </div>
        )}

          <button
            type="submit"
            disabled={isAdminLogin ? !apiKey.trim() || !password.trim() : !password.trim()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isAdminLogin ? 'Activate Terminal' : 'Start Teaching'}
          </button>
          {isActivated && (
            <button
              type="button"
              onClick={() => setIsAdminLogin(!isAdminLogin)}
              className="mt-2 w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow transition-colors"
            >
              {isAdminLogin ? 'Switch to Teacher Login' : 'Switch to Admin Login'}
            </button>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            {showGuide ? 'Hide' : 'Show'} Usage Guide & Cost Planning
          </button>
          {showGuide && (
            <div className="mt-4">
              <UsageGuide />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
