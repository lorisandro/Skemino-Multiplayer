import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MatchmakingDemo } from './pages/MatchmakingDemo';
import { GameRoom } from './components/gaming/GameRoom';
import { GameInterface } from './components/gaming/GameInterface';
import AuthDemo from './pages/AuthDemo';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './components/HomePage';
import { useAuth } from './hooks/useAuth';

type AppMode = 'home' | 'game' | 'auth';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState<AppMode>('home');

  // If user is authenticated, show dashboard
  if (isAuthenticated && user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<AuthDemo />} />
          <Route path="/dashboard" element={<AuthDemo />} />
          <Route path="/game" element={<GameInterface className="demo-mode" />} />
          <Route path="/game/:roomId" element={<GameRoom />} />
          <Route path="*" element={<AuthDemo />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/demo" element={<MatchmakingDemo />} />
        <Route path="/game" element={<MatchmakingDemo />} />
        <Route path="/game/:roomId" element={<GameRoom />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Development Navigation - only show when not authenticated */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        <button
          onClick={() => setMode('home')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'home'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🏠 Home
        </button>
        <button
          onClick={() => setMode('auth')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'auth'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🔐 Auth Demo
        </button>
        <button
          onClick={() => setMode('game')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'game'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🎮 Game Demo
        </button>
      </div>
    </Router>
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