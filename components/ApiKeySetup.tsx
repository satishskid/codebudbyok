
import React, { useState } from 'react';
import { SparklesIcon, ExclamationTriangleIcon, ClockIcon, UserGroupIcon } from './icons';
import { UsageGuide } from './UsageGuide';

interface ApiKeySetupProps {
  onAdminSetup: (key: string, password: string, terminalName: string, terminalPassword: string) => boolean;
  onTeacherLogin: (password: string) => boolean;
  isActivated: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  onAdminSetup, 
  onTeacherLogin,
  isActivated 
}) => {
  // Admin setup form state
  const [adminPassword, setAdminPassword] = useState('');
  const [step, setStep] = useState<'admin-auth' | 'admin-setup' | 'teacher-login'>(
    isActivated ? 'teacher-login' : 'admin-auth'
  );
  
  // Admin setup details
  const [terminalName, setTerminalName] = useState('');
  const [terminalPassword, setTerminalPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  // Teacher login state
  const [teacherPassword, setTeacherPassword] = useState('');
  
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState('');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (adminPassword.trim() === 'Skidmin2025') {
      setStep('admin-setup');
    } else {
      setError('Invalid admin password');
    }
  };

  const handleAdminSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!terminalName.trim() || !terminalPassword.trim() || !apiKey.trim()) {
      setError('All fields are required');
      return;
    }

    const success = onAdminSetup(apiKey.trim(), adminPassword, terminalName.trim(), terminalPassword.trim());
    if (!success) {
      setError('Setup failed. Please try again.');
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!teacherPassword.trim()) {
      setError('Password is required');
      return;
    }

    const success = onTeacherLogin(teacherPassword.trim());
    if (!success) {
      setError('Invalid password');
    }
  };

  const renderAdminAuth = () => (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full p-4 mb-4">
          <SparklesIcon className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">System Setup Required</h1>
        <p className="text-gray-600">Administrator authentication needed for initial setup</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAdminAuth} className="space-y-4">
        <div>
          <label htmlFor="adminAuth" className="block text-sm font-medium text-gray-700 mb-1">
            Admin Password
          </label>
          <input
            id="adminAuth"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            placeholder="Enter admin password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition-colors"
        >
          Authenticate
        </button>
      </form>
    </div>
  );

  const renderAdminSetup = () => (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-500 rounded-full p-4 mb-4">
          <SparklesIcon className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configure Your Terminal</h1>
        <p className="text-gray-600">Set up your Code Buddy learning environment</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAdminSetup} className="space-y-4">
        <div>
          <label htmlFor="terminalName" className="block text-sm font-medium text-gray-700 mb-1">
            Terminal Name
          </label>
          <input
            id="terminalName"
            type="text"
            value={terminalName}
            onChange={(e) => setTerminalName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g., ABC School, XYZ Institute"
            required
          />
          <p className="text-xs text-gray-500 mt-1">This will be displayed to users</p>
        </div>

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
            placeholder="Enter your Google Gemini API key"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a>
          </p>
        </div>

        <div>
          <label htmlFor="terminalPass" className="block text-sm font-medium text-gray-700 mb-1">
            Terminal Password
          </label>
          <input
            id="terminalPass"
            type="password"
            value={terminalPassword}
            onChange={(e) => setTerminalPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Create password for teachers and students"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Teachers and students will use this password</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors"
        >
          Activate Terminal
        </button>
      </form>
    </div>
  );

  const renderTeacherLogin = () => (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-green-100 text-green-500 rounded-full p-4 mb-4">
          <UserGroupIcon className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Enter your password to start teaching or learning</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleTeacherLogin} className="space-y-4">
        <div>
          <label htmlFor="teacherPass" className="block text-sm font-medium text-gray-700 mb-1">
            Terminal Password
          </label>
          <input
            id="teacherPass"
            type="password"
            value={teacherPassword}
            onChange={(e) => setTeacherPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition-colors"
        >
          Start Learning
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          For teachers: Use this same password to access the teaching interface
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {step === 'admin-auth' && renderAdminAuth()}
        {step === 'admin-setup' && renderAdminSetup()}
        {step === 'teacher-login' && renderTeacherLogin()}

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
