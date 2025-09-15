import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { RegisterCredentials } from '../types/auth';

interface RegisterPageProps {
  onRegister?: (credentials: RegisterCredentials) => void;
  onNavigateToLogin?: () => void;
  onSocialLogin?: (provider: string) => void;
  className?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

/**
 * RegisterPage - Pagina di registrazione gaming professionale Skèmino
 * Design integrato con LoginPage e sistema dark esistente
 */
export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onNavigateToLogin,
  onSocialLogin,
  className = '',
}) => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterCredentials, string>>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Molto debole',
    color: 'red',
    requirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    },
  });
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

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password: string): PasswordStrength => {
      const requirements = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };

      const score = Object.values(requirements).filter(Boolean).length;

      const strength = {
        0: { label: 'Molto debole', color: 'red' },
        1: { label: 'Debole', color: 'red' },
        2: { label: 'Sufficiente', color: 'orange' },
        3: { label: 'Buona', color: 'yellow' },
        4: { label: 'Forte', color: 'green' },
        5: { label: 'Molto forte', color: 'green' },
      }[score] || { label: 'Molto debole', color: 'red' };

      return {
        score,
        label: strength.label,
        color: strength.color,
        requirements,
      };
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterCredentials, string>> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username richiesto';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve essere almeno 3 caratteri';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username deve essere massimo 20 caratteri';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username può contenere solo lettere, numeri, _ e -';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Formato email non valido';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password troppo debole (minimo 3/5)';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Conferma password richiesta';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Devi accettare i termini di servizio';
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
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onRegister) {
        onRegister(formData);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Errore durante la registrazione' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);

    try {
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
  const handleInputChange = (field: keyof RegisterCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field] && typeof value === 'string' && value.trim()) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Password requirement component
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <motion.div
      className={`flex items-center space-x-2 text-xs transition-colors ${
        met ? 'text-green-400' : 'text-gray-400'
      }`}
      animate={{ opacity: met ? 1 : 0.6 }}
    >
      {met ? (
        <CheckCircleIcon className="w-3 h-3" />
      ) : (
        <XCircleIcon className="w-3 h-3" />
      )}
      <span>{text}</span>
    </motion.div>
  );

  // Social providers config
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: '🇬',
      bgColor: 'from-red-500 to-orange-500',
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: '💬',
      bgColor: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
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
            Unisciti alla community gaming strategica
          </motion.p>
        </motion.div>

        {/* Main Registration Card */}
        <motion.div
          className={`w-full ${
            layout === 'mobile'
              ? 'max-w-sm'
              : layout === 'tablet'
              ? 'max-w-md'
              : 'max-w-2xl'
          } bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className={layout === 'desktop' ? 'grid grid-cols-2 gap-8' : 'space-y-8'}>
            {/* Registration Form */}
            <div className={layout === 'desktop' ? '' : 'order-2'}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Crea il tuo account
              </h2>

              {/* Social Login Buttons */}
              <div className="mb-6">
                <p className="text-center text-gray-300 text-sm mb-4">Registrazione rapida</p>
                <div className="grid grid-cols-2 gap-3">
                  {socialProviders.map((provider) => (
                    <motion.button
                      key={provider.id}
                      onClick={() => handleSocialLogin(provider.id)}
                      disabled={isLoading}
                      className={`
                        px-4 py-3 rounded-lg font-medium text-white text-sm
                        bg-gradient-to-r ${provider.bgColor}
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200 shadow-lg
                      `}
                      whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">{provider.icon}</span>
                        <span>{provider.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-300 rounded-full">o compila il form</span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username Gaming
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <motion.input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`
                        block w-full pl-10 pr-3 py-3 border rounded-lg
                        bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                        ${errors.username
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 hover:border-gray-500'
                        }
                      `}
                      placeholder="mario_gamer"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.username && (
                      <motion.p
                        className="mt-2 text-sm text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <motion.input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`
                        block w-full pl-10 pr-3 py-3 border rounded-lg
                        bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                        ${errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 hover:border-gray-500'
                        }
                      `}
                      placeholder="mario@email.com"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        className="mt-2 text-sm text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.email}
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
                      placeholder="Password sicura"
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full transition-colors duration-300 ${
                              passwordStrength.color === 'red' ? 'bg-red-500' :
                              passwordStrength.color === 'orange' ? 'bg-orange-500' :
                              passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.color === 'red' ? 'text-red-400' :
                          passwordStrength.color === 'orange' ? 'text-orange-400' :
                          passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <PasswordRequirement met={passwordStrength.requirements.length} text="8+ caratteri" />
                        <PasswordRequirement met={passwordStrength.requirements.lowercase} text="Minuscole" />
                        <PasswordRequirement met={passwordStrength.requirements.uppercase} text="Maiuscole" />
                        <PasswordRequirement met={passwordStrength.requirements.number} text="Numeri" />
                      </div>
                    </motion.div>
                  )}

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

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Conferma Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <motion.input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`
                        block w-full pl-10 pr-12 py-3 border rounded-lg
                        bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                        ${errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 hover:border-gray-500'
                        }
                      `}
                      placeholder="Ripeti la password"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p
                        className="mt-2 text-sm text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <motion.input
                      id="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800 mt-1"
                      whileTap={{ scale: 0.9 }}
                    />
                    <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
                      Accetto i{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        Termini di Servizio
                      </a>{' '}
                      e la{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  <AnimatePresence>
                    {errors.acceptTerms && (
                      <motion.p
                        className="text-sm text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.acceptTerms}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex items-start">
                    <motion.input
                      id="subscribeNewsletter"
                      type="checkbox"
                      checked={formData.subscribeNewsletter}
                      onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800 mt-1"
                      whileTap={{ scale: 0.9 }}
                    />
                    <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-300">
                      Iscriviti alla newsletter per aggiornamenti e tornei (facoltativo)
                    </label>
                  </div>
                </div>

                {/* Register Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || !formData.acceptTerms}
                  className={`
                    w-full py-3 px-4 rounded-lg font-semibold text-white
                    bg-gradient-to-r from-blue-600 to-purple-600
                    hover:from-blue-700 hover:to-purple-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 shadow-lg
                    flex items-center justify-center space-x-2
                  `}
                  whileHover={!isLoading && formData.acceptTerms ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isLoading && formData.acceptTerms ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Creazione account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Crea Account</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  )}
                </motion.button>
              </form>

              {/* Login Link */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <p className="text-gray-300 text-sm">
                  Hai già un account?{' '}
                  <button
                    onClick={onNavigateToLogin}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Accedi qui
                  </button>
                </p>
              </motion.div>
            </div>

            {/* Benefits Section (Desktop only) */}
            {layout === 'desktop' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  Perché iscriversi a Skèmino?
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <TrophyIcon className="w-8 h-8 text-yellow-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Sistema Ranking ELO</h4>
                    <p className="text-sm text-gray-300">
                      Compete nei livelli da Principiante a Super Gran Maestro con un sistema di rating preciso
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <ChartBarIcon className="w-8 h-8 text-blue-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Statistiche Dettagliate</h4>
                    <p className="text-sm text-gray-300">
                      Traccia le tue performance, analizza le partite e migliora le tue strategie
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <ShieldCheckIcon className="w-8 h-8 text-green-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Gaming Sicuro</h4>
                    <p className="text-sm text-gray-300">
                      Anti-cheat avanzato e fair play garantito per un'esperienza competitiva autentica
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
                    <h4 className="font-semibold text-white mb-2">🎮 Subito Disponibile</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Matchmaking automatico</li>
                      <li>• Tornei settimanali</li>
                      <li>• Chat e social features</li>
                      <li>• Analisi partite AI</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-xs text-gray-500 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p>
            Registrandoti accetti i nostri{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Termini di Servizio
            </a>,{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </a>{' '}
            e{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Cookie Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;