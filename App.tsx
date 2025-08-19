import React, { useState } from 'react';
import ApiKeySetup from './components/ApiKeySetup';
import ChatView from './components/ChatView';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { 
    authState: { apiKey, isAdmin, isActivated, terminalName },
    keyStatus, 
    adminSetup,
    teacherLogin,
    logout, 
    recheckKeyHealth
  } = useAuth();
  const [view, setView] = useState<'home' | 'chat' | 'admin'>('home');

  const handleGoHome = () => {
    setView('home');
  };

  const renderContent = () => {
    // If system is not activated, show admin setup (one-time)
    if (!isActivated || !apiKey) {
      return <ApiKeySetup 
        onAdminSetup={adminSetup}
        onTeacherLogin={teacherLogin}
        isActivated={isActivated}
      />;
    }
    
    // If admin is logged in, show admin dashboard
    if (isAdmin) {
      return <AdminDashboard keyStatus={keyStatus} onRecheck={recheckKeyHealth} terminalName={terminalName} />;
    }
    
    // If in chat view, show the learning interface
    if (view === 'chat') {
      return <ChatView studentName="Student" />;
    }
    
    // Home view - welcome screen for teachers/students
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome to {terminalName || 'Code Buddy'}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">Your personal AI coding tutor. Ready to start learning?</p>
          <button
            onClick={() => setView('chat')}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100">
      <Header 
        apiKey={apiKey}
        isAdmin={isAdmin}
        terminalName={terminalName}
        onLogout={logout}
        onGoHome={view !== 'home' ? handleGoHome : undefined}
      />
      <main className="flex-grow overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;