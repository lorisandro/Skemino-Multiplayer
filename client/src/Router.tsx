import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AppDebug from './App.debug';

// Pages
const HomePage = () => {
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
  const AppComponent = isDebugMode ? AppDebug : App;
  return <AppComponent />;
};

const GamePage = () => {
  return <App />;
};

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game/:roomId" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}