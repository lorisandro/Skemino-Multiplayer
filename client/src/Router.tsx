import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from './App';
import AppDebug from './App.debug';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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
    navigate('/login');
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Social login attempt:', provider);
    // TODO: Implement actual social login logic
    navigate('/game');
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game/:roomId" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}