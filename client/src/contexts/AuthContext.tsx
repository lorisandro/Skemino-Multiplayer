import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthContextType } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthContext - Context per la gestione globale dell'autenticazione Skèmino
 * Fornisce accesso alle funzioni di auth in tutta l'applicazione
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Provider che wrappa l'app e fornisce il context di autenticazione
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuthContext - Hook per accedere al context di autenticazione
 * Deve essere usato dentro un AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

/**
 * withAuth - HOC per proteggere componenti che richiedono autenticazione
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white text-lg">Verifica autenticazione...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // In un'app reale, qui redirigi alla login page
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Accesso Richiesto</h1>
            <p className="text-gray-300 mb-6">
              Devi essere autenticato per accedere a questa pagina.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Vai al Login
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
};

/**
 * RequireAuth - Componente per proteggere routes che richiedono autenticazione
 */
export const RequireAuth: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback
}) => {
  const { isAuthenticated, isLoading, user, isInitializing } = useAuthContext();
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);

  // Handle loading timeout protection
  React.useEffect(() => {
    // Set a maximum timeout for loading state (reduced from 2000ms to 1000ms)
    const timeoutTimer = setTimeout(() => {
      if (isLoading) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Auth loading timeout reached, checking stored tokens');
        }
        setLoadingTimeout(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutTimer);
    };
  }, [isLoading]);

  // Only log in development to avoid console noise
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 RequireAuth check:', {
      isAuthenticated,
      isLoading,
      isInitializing,
      loadingTimeout,
      user: user?.username || 'none',
      hasStoredToken: !!(localStorage.getItem('skemino_auth_token') || sessionStorage.getItem('skemino_auth_token'))
    });
  }

  // During initialization, show loading
  if ((isLoading || isInitializing) && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">Caricamento...</p>
        </div>
      </div>
    );
  }

  // If loading timeout reached but we have stored tokens, allow access
  if (loadingTimeout && (localStorage.getItem('skemino_auth_token') || sessionStorage.getItem('skemino_auth_token'))) {
    console.log('✅ Loading timeout but tokens found, allowing access');
    return <>{children}</>;
  }

  // Check authentication state
  if (!isAuthenticated) {
    console.log('❌ RequireAuth: User not authenticated, redirecting to login');
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Accesso Richiesto</h1>
          <p className="text-gray-300">
            Devi essere autenticato per accedere a questa sezione.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthContext;