import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppDebug from './App.debug';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

// Usa App di debug se il parametro ?debug=true è presente
const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
const AppComponent = isDebugMode ? AppDebug : App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppComponent />
    </ErrorBoundary>
  </React.StrictMode>
);