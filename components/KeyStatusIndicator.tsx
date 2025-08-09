import React from 'react';
import { KeyStatus } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from './icons';

interface KeyStatusIndicatorProps {
  status: KeyStatus;
}

const KeyStatusIndicator: React.FC<KeyStatusIndicatorProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <ClockIcon className="w-5 h-5 text-blue-500" />,
          text: 'Checking API Key',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'healthy':
        return {
          icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
          text: 'API Key Valid',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'throttled':
        return {
          icon: <ClockIcon className="w-5 h-5 text-yellow-500" />,
          text: 'API Key Throttled',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      case 'invalid':
        return {
          icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />,
          text: 'API Key Invalid',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'error':
      default:
        return {
          icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />,
          text: 'Connection Error',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
    }
  };

  const { icon, text, bgColor, textColor } = getStatusInfo();

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      <span className="mr-1">{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default KeyStatusIndicator;