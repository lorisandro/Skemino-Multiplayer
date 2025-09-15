import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, RequireAuth, useAuthContext } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import toast from 'react-hot-toast';
import App from './App';
import AppDebug from './App.debug';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PreGamePage from './pages/PreGamePage';
import { MatchmakingDemo } from './pages/MatchmakingDemo';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const GamePage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <MatchmakingDemo />
    </DndProvider>
  );
};

const RegisterPageWrapper = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleRegister = async (credentials: any) => {
    try {
      const response = await register(credentials);

      if (response.success) {
        toast.success('Registrazione completata con successo!');
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Registrazione fallita');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Errore durante la registrazione');
      throw error; // Re-throw per far gestire l'errore al componente
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      // TODO: Implement actual social login logic when backend is ready
      toast.error('Login social non ancora disponibile');
    } catch (error) {
      console.error('Social login error:', error);
      toast.error('Errore durante il login social');
      throw error;
    }
  };

  return (
    <RegisterPage
      onNavigateToLogin={handleNavigateToLogin}
      onRegister={handleRegister}
      onSocialLogin={handleSocialLogin}
    />
  );
};

export function Router() {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPageWrapper />} />
          <Route path="/dashboard" element={
            <RequireAuth fallback={<Navigate to="/login" replace />}>
              <DashboardPage />
            </RequireAuth>
          } />
          <Route path="/pregame" element={
            <RequireAuth fallback={<Navigate to="/login" replace />}>
              <PreGamePage />
            </RequireAuth>
          } />
          <Route path="/game" element={
            <RequireAuth fallback={<Navigate to="/login" replace />}>
              <GamePage />
            </RequireAuth>
          } />
          <Route path="/game/:roomId" element={
            <RequireAuth fallback={<Navigate to="/login" replace />}>
              <GamePage />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}