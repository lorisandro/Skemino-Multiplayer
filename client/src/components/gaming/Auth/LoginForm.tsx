import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onBack: () => void;
}

/**
 * LoginForm - Form di login dark theme gaming ottimizzato per Skèmino
 * Design minimale dark-first con feedback visuale per gaming UX
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onBack,
}) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email o username richiesto';
    } else if (formData.identifier.includes('@') && !/\S+@\S+\.\S+/.test(formData.identifier)) {
      newErrors.identifier = 'Email non valida';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password troppo corta (min 6 caratteri)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitAttempted && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) return;

    try {
      const result = await login(formData);
      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message || 'Errore durante il login' });
      }
    } catch (error) {
      setErrors({ general: 'Errore di connessione' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <h3 className="text-text-primary font-semibold text-sm">Accedi</h3>
        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-error-dark/20 border border-error-dark/30 rounded text-error-dark text-xs flex items-center space-x-2"
          >
            <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
            <span>{errors.general}</span>
          </motion.div>
        )}

        {/* Email/Username Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">
            Email o Username
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <EnvelopeIcon className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) => handleInputChange('identifier', e.target.value)}
              placeholder="email@esempio.com"
              className={`
                w-full pl-10 pr-3 py-2 bg-skemino-dark-primary border rounded
                text-text-primary placeholder-text-muted text-sm
                focus:outline-none focus:ring-2 transition-colors
                ${errors.identifier
                  ? 'border-error-dark focus:ring-error-dark/30'
                  : 'border-border-dark focus:border-suit-forbici-dark focus:ring-suit-forbici-dark/30'
                }
              `}
            />
          </div>
          {errors.identifier && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-error-dark"
            >
              {errors.identifier}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <LockClosedIcon className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              className={`
                w-full pl-10 pr-10 py-2 bg-skemino-dark-primary border rounded
                text-text-primary placeholder-text-muted text-sm
                focus:outline-none focus:ring-2 transition-colors
                ${errors.password
                  ? 'border-error-dark focus:ring-error-dark/30'
                  : 'border-border-dark focus:border-suit-forbici-dark focus:ring-suit-forbici-dark/30'
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-error-dark"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="w-3 h-3 rounded border-border-dark bg-skemino-dark-primary
                       text-suit-forbici-dark focus:ring-suit-forbici-dark/30 focus:ring-1"
            />
            <span className="text-xs text-text-muted">Ricordami</span>
          </label>
          <button
            type="button"
            className="text-xs text-suit-forbici-dark hover:text-suit-forbici-dark/80 transition-colors"
          >
            Password dimenticata?
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-suit-forbici-dark to-suit-forbici-dark/80
                   text-white rounded font-medium text-sm
                   hover:from-suit-forbici-dark/90 hover:to-suit-forbici-dark/70
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center justify-center space-x-2"
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          whileTap={!isLoading ? { scale: 0.99 } : {}}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Accesso...</span>
            </>
          ) : (
            <span>Accedi</span>
          )}
        </motion.button>

        {/* Switch to Register */}
        <div className="text-center">
          <p className="text-xs text-text-muted">
            Non hai un account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-suit-carta-dark hover:text-suit-carta-dark/80 font-medium transition-colors"
            >
              Registrati
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-2 bg-info-dark/20 border border-info-dark/30 rounded">
          <p className="text-xs text-info-dark font-medium mb-1">Demo:</p>
          <p className="text-xs text-info-dark">Email: demo@skemino.com</p>
          <p className="text-xs text-info-dark">Password: demo123</p>
        </div>
      </form>
    </motion.div>
  );
};