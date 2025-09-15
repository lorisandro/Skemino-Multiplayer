import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface LoginPageProps {
  onLogin?: (credentials: LoginCredentials) => void;
  onNavigateToRegister?: () => void;
  onSocialLogin?: (provider: SocialProvider) => void;
  className?: string;
}

interface LoginCredentials {
  identifier: string; // email or username
  password: string;
  rememberMe: boolean;
}

type SocialProvider = 'google' | 'discord' | 'facebook' | 'apple';

/**
 * LoginPage - Pagina di accesso gaming professionale tipo chess.com
 * Integrata con il design system dark Skèmino esistente
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onNavigateToRegister,
  onSocialLogin,
  className = '',
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginCredentials, string>>>({});
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Responsive layout detection
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 768) setLayout('mobile');
      else if (width < 1024) setLayout('tablet');
      else setLayout('desktop');
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginCredentials, string>> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email o username richiesti';
    } else if (formData.identifier.includes('@')) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identifier)) {
        newErrors.identifier = 'Formato email non valido';
      }
    } else if (formData.identifier.length < 3) {
      newErrors.identifier = 'Username deve essere almeno 3 caratteri';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (onLogin) {
        onLogin(formData);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ identifier: 'Credenziali non valide' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(true);

    try {
      // Simulate social auth
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSocialLogin) {
        onSocialLogin(provider);
      }
    } catch (error) {
      console.error('Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Input change handler
  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field] && typeof value === 'string' && value.trim()) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Social login buttons configuration
  const socialProviders = [
    {
      id: 'google' as SocialProvider,
      name: 'Google',
      icon: '🇬',
      bgColor: 'from-red-500 to-orange-500',
      hoverColor: 'from-red-600 to-orange-600',
    },
    {
      id: 'discord' as SocialProvider,
      name: 'Discord',
      icon: '💬',
      bgColor: 'from-indigo-500 to-purple-500',
      hoverColor: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'facebook' as SocialProvider,
      name: 'Facebook',
      icon: '📘',
      bgColor: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800',
    },
    {
      id: 'apple' as SocialProvider,
      name: 'Apple',
      icon: '🍎',
      bgColor: 'from-gray-600 to-gray-800',
      hoverColor: 'from-gray-700 to-gray-900',
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header Logo Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Skèmino Logo */}
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl mr-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Skèmino
            </h1>
          </motion.div>

          <motion.p
            className="text-lg text-gray-300 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Accedi al tuo account per iniziare a giocare
          </motion.p>
        </motion.div>

        {/* Main Login Card */}
        <motion.div
          className={`w-full ${
            layout === 'mobile'
              ? 'max-w-sm'
              : layout === 'tablet'
              ? 'max-w-md'
              : 'max-w-lg'
          } bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Social Login Buttons */}
          <div className="mb-8">
            <p className="text-center text-gray-300 text-sm mb-4">Accesso rapido con</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {socialProviders.map((provider) => (
                <motion.button
                  key={provider.id}
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={isLoading}
                  className={`
                    relative overflow-hidden px-4 py-3 rounded-lg font-medium text-white text-sm
                    bg-gradient-to-r ${provider.bgColor}
                    hover:${provider.hoverColor}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 shadow-lg
                  `}
                  whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">{provider.icon}</span>
                    <span className="hidden md:block">{provider.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800/50 text-gray-300 rounded-full">oppure con email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Input */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-300 mb-2">
                Email o Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <motion.input
                  id="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange('identifier', e.target.value)}
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg
                    bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.identifier
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 hover:border-gray-500'
                    }
                  `}
                  placeholder="mario.rossi@email.com o mario_gamer"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <AnimatePresence>
                {errors.identifier && (
                  <motion.p
                    className="mt-2 text-sm text-red-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.identifier}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <motion.input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-lg
                    bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 hover:border-gray-500'
                    }
                  `}
                  placeholder="La tua password sicura"
                  whileFocus={{ scale: 1.01 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="mt-2 text-sm text-red-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                  whileTap={{ scale: 0.9 }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Ricordami
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Password dimenticata?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold text-white
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-700 hover:to-purple-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg
                flex items-center justify-center space-x-2
              `}
              whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Accesso in corso...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Accedi</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="text-gray-300 text-sm">
              Non hai ancora un account?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Registrati ora
              </button>
            </p>
          </div>
        </motion.div>

        {/* Security & Features Info */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
            <ShieldCheckIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Sicurezza Avanzata</h3>
            <p className="text-xs text-gray-400">
              Autenticazione a due fattori e crittografia end-to-end
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
            <GlobeAltIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Gaming Globale</h3>
            <p className="text-xs text-gray-400">
              Gioca con avversari da tutto il mondo in tempo reale
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
            <ComputerDesktopIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">Multi-Piattaforma</h3>
            <p className="text-xs text-gray-400">
              Desktop, tablet e mobile con sincronizzazione completa
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p>
            Accedendo accetti i nostri{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Termini di Servizio
            </a>{' '}
            e la{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;