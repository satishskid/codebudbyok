import React, { useState } from 'react';
import { KeyStatus } from '../types';
import { SparklesIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from './icons';

interface AdminDashboardProps {
  keyStatus: KeyStatus;
  onRecheck: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ keyStatus, onRecheck }) => {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Code Buddy terminal</p>
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

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">Usage Statistics</h2>
        <p className="text-gray-600 mb-2">This is a demo version of Code Buddy.</p>
        <p className="text-gray-600">In a full version, you would see usage statistics here, such as:</p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Number of active students</li>
          <li>API usage and quota information</li>
          <li>Session history</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;