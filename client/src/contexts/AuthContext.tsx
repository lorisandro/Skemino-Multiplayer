import React, { createContext, useContext, ReactNode } from 'react';
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
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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