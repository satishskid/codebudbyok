import React, { useState } from 'react';
import { KeyStatus } from '../types';
import { SparklesIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon, BuildingOfficeIcon } from './icons';

interface AdminDashboardProps {
  keyStatus: KeyStatus;
  terminalName: string | null;
  onRecheck: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ keyStatus, terminalName, onRecheck }) => {
  const [isRechecking, setIsRechecking] = useState(false);

  const handleRecheck = async () => {
    setIsRechecking(true);
    await onRecheck();
    setIsRechecking(false);
  };

  const getStatusContent = () => {
    switch (keyStatus) {
      case 'checking':
        return {
          icon: <ClockIcon className="w-8 h-8 text-blue-500" />,
          title: 'Checking API Key',
          description: 'Verifying your Gemini API key...',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'healthy':
        return {
          icon: <CheckCircleIcon className="w-8 h-8 text-green-500" />,
          title: 'API Key Valid',
          description: 'Your Gemini API key is working correctly.',
          color: 'bg-green-100 text-green-800'
        };
      case 'throttled':
        return {
          icon: <ClockIcon className="w-8 h-8 text-yellow-500" />,
          title: 'API Key Throttled',
          description: 'Your Gemini API key is being rate limited. This is normal and should resolve shortly.',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'invalid':
        return {
          icon: <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />,
          title: 'API Key Invalid',
          description: 'Your Gemini API key appears to be invalid or has insufficient permissions.',
          color: 'bg-red-100 text-red-800'
        };
      case 'error':
      default:
        return {
          icon: <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />,
          title: 'Connection Error',
          description: 'Unable to connect to the Gemini API. Please check your internet connection.',
          color: 'bg-red-100 text-red-800'
        };
    }
  };

  const { icon, title, description, color } = getStatusContent();

  return (
    <div className="flex flex-col h-full p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BuildingOfficeIcon className="w-8 h-8 text-indigo-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{terminalName || 'Code Buddy'}</h1>
            <p className="text-gray-600">Administrator Dashboard</p>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg mb-6 ${color}`}>
        <div className="flex items-center">
          <div className="mr-4">{icon}</div>
          <div>
            <h2 className="font-bold text-lg">{title}</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">API Key Management</h2>
          <button
            onClick={handleRecheck}
            disabled={isRechecking || keyStatus === 'checking'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            {isRechecking ? 'Checking...' : 'Recheck API Key'}
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Terminal Info</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {terminalName || 'Not set'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> 
              <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Active
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Access:</span> Teachers & Students
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">AI Tutor</h3>
            <p className="text-2xl font-bold text-green-600">Active</p>
            <p className="text-xs text-gray-500">Google Gemini AI</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">Curriculum</h3>
            <p className="text-2xl font-bold text-blue-600">3 Levels</p>
            <p className="text-xs text-gray-500">Junior, Explorer, Advanced</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">Languages</h3>
            <p className="text-2xl font-bold text-purple-600">6 Supported</p>
            <p className="text-xs text-gray-500">Including Hindi, Tamil</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-gray-600 mb-2">
            <strong>System Status:</strong> Your Code Buddy terminal is fully operational and ready for learning sessions.
          </p>
          <p className="text-sm text-gray-500">
            Teachers and students can now access the learning interface using the terminal password you configured.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;