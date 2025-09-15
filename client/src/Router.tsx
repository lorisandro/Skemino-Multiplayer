import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './contexts/AuthContext';
import App from './App';
import AppDebug from './App.debug';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PreGamePage from './pages/PreGamePage';

const GamePage = () => {
  return <App />;
};

const RegisterPageWrapper = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleRegister = (credentials: any) => {
    console.log('Registration attempt:', credentials);
    // TODO: Implement actual registration logic
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Social login attempt:', provider);
    // TODO: Implement actual social login logic
    navigate('/register');
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