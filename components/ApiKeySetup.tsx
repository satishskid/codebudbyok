
import React, { useState } from 'react';
import { SparklesIcon, ExclamationTriangleIcon, ClockIcon } from './icons';
import { UsageGuide } from './UsageGuide';

interface ApiKeySetupProps {
  onAdminLogin: (key: string, password: string, terminalPassword: string) => boolean;
  onTeacherLogin: (password: string) => boolean;
  isActivated: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  onAdminLogin, 
  onTeacherLogin,
  isActivated 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [terminalPassword, setTerminalPassword] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(!isActivated);
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!apiKey.trim() || !adminPassword.trim() || !terminalPassword.trim()) {
      setError('All fields are required for admin setup');
      return;
    }

    const success = onAdminLogin(apiKey.trim(), adminPassword.trim(), terminalPassword.trim());
    if (!success) {
      setError('Invalid admin password');
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!teacherPassword.trim()) {
      setError('Terminal password is required');
      return;
    }

    const success = onTeacherLogin(teacherPassword.trim());
    if (!success) {
      setError('Invalid terminal password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-500 rounded-full p-4 mb-4">
              <SparklesIcon className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Code Buddy</h1>
            <p className="text-gray-600">
              {isAdminMode ? 'Admin Setup - Configure the system' : 'Teacher Login - Start teaching'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isAdminMode ? (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Gemini API Key
                </label>
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

              <div>
                <label htmlFor="adminPass" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  id="adminPass"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <div>
                <label htmlFor="terminalPass" className="block text-sm font-medium text-gray-700 mb-1">
                  Set Terminal Password
                </label>
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

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors"
              >
                Activate Terminal
              </button>
            </form>
          ) : (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label htmlFor="teacherPass" className="block text-sm font-medium text-gray-700 mb-1">
                  Terminal Password
                </label>
                <input
                  id="teacherPass"
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter terminal password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors"
              >
                Start Teaching
              </button>
            </form>
          )}

          {isActivated && (
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setError('');
              }}
              className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              {isAdminMode ? 'Switch to Teacher Login' : 'Switch to Admin Setup'}
            </button>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center w-full justify-center"
          >
            {showGuide ? 'Hide' : 'Show'} Usage Guide & Cost Planning
          </button>
        </div>

        {showGuide && (
          <div className="border-t border-gray-200 bg-gray-50 max-h-96 overflow-y-auto">
            <UsageGuide />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeySetup;
