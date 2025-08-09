
import React from 'react';
import { ArrowLeftOnRectangleIcon, SparklesIcon, UserCircleIcon, HomeIcon } from './icons';

interface HeaderProps {
  apiKey: string | null;
  isAdmin: boolean;
  onLogout: () => void;
  onGoHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, isAdmin, onLogout, onGoHome }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md z-10 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <img 
          src="/skids-logo.svg" 
          alt="SKIDS Logo" 
          className="h-10 w-auto" 
        />
        <SparklesIcon className="w-10 h-10 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Code Buddy</h1>
          <p className="text-xs text-gray-500">Powered by greybrain.ai</p>
        </div>
      </div>
      
      <nav className="flex items-center space-x-4">
        {apiKey && (
          <>
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center px-4 py-2 rounded-lg font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                title="Back to Home"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Home
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
