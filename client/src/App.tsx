import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MatchmakingDemo } from './pages/MatchmakingDemo';
import AuthDemo from './pages/AuthDemo';
import { useAuth } from './hooks/useAuth';

type AppMode = 'game' | 'auth';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState<AppMode>('game');

  // If user is authenticated, always show dashboard (handled by AuthDemo)
  if (isAuthenticated && user) {
    return <AuthDemo />;
  }

  // If not authenticated, show auth demo
  if (!isAuthenticated) {
    return <AuthDemo />;
  }

  return (
    <>
      {/* Development Navigation - only show when not authenticated */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <button
          onClick={() => setMode('auth')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'auth'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Auth Demo
        </button>
        <button
          onClick={() => setMode('game')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'game'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Game Demo
        </button>
      </div>

      {/* Render current mode */}
      {mode === 'auth' ? <AuthDemo /> : <MatchmakingDemo />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;