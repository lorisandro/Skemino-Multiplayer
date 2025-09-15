import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

/**
 * RegisterForm - Form di registrazione dark theme gaming per Skèmino
 * Design minimale dark-first con validazione real-time e feedback UX
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  onBack,
}) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Real-time validation
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Username richiesto';
        if (value.length < 3) return 'Username troppo corto (min 3 caratteri)';
        if (value.length > 20) return 'Username troppo lungo (max 20 caratteri)';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo lettere, numeri e underscore';
        return '';

      case 'email':
        if (!value.trim()) return 'Email richiesta';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email non valida';
        return '';

      case 'password':
        if (!value) return 'Password richiesta';
        if (value.length < 8) return 'Password troppo corta (min 8 caratteri)';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password deve contenere maiuscole, minuscole e numeri';
        }
        return '';

      case 'confirmPassword':
        if (!value) return 'Conferma password richiesta';
        if (value !== formData.password) return 'Le password non corrispondono';
        return '';

      default:
        return '';
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];

    strength = checks.filter(Boolean).length;

    if (strength <= 2) return { level: 'weak', color: 'text-error-dark', label: 'Debole' };
    if (strength === 3) return { level: 'medium', color: 'text-warning-dark', label: 'Media' };
    if (strength === 4) return { level: 'good', color: 'text-info-dark', label: 'Buona' };
    return { level: 'strong', color: 'text-success-dark', label: 'Forte' };
  };

  // Handle input change
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (typeof value === 'string' && submitAttempted) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    newErrors.username = validateField('username', formData.username);
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Devi accettare i termini di servizio';
    }

    // Filter out empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) return;

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message || 'Errore durante la registrazione' });
      }
    } catch (error) {
      setErrors({ general: 'Errore di connessione' });
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
        <h3 className="text-text-primary font-semibold text-sm">Registrati</h3>
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

        {/* Username Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <UserIcon className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="SkeminoMaster"
              className={`
                w-full pl-10 pr-3 py-2 bg-skemino-dark-primary border rounded
                text-text-primary placeholder-text-muted text-sm
                focus:outline-none focus:ring-2 transition-colors
                ${errors.username
                  ? 'border-error-dark focus:ring-error-dark/30'
                  : formData.username && !validateField('username', formData.username)
                  ? 'border-success-dark focus:ring-success-dark/30'
                  : 'border-border-dark focus:border-suit-carta-dark focus:ring-suit-carta-dark/30'
                }
              `}
            />
            {formData.username && !errors.username && !validateField('username', formData.username) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckIcon className="w-4 h-4 text-success-dark" />
              </div>
            )}
          </div>
          {errors.username && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-error-dark"
            >
              {errors.username}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <EnvelopeIcon className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@esempio.com"
              className={`
                w-full pl-10 pr-3 py-2 bg-skemino-dark-primary border rounded
                text-text-primary placeholder-text-muted text-sm
                focus:outline-none focus:ring-2 transition-colors
                ${errors.email
                  ? 'border-error-dark focus:ring-error-dark/30'
                  : formData.email && !validateField('email', formData.email)
                  ? 'border-success-dark focus:ring-success-dark/30'
                  : 'border-border-dark focus:border-suit-carta-dark focus:ring-suit-carta-dark/30'
                }
              `}
            />
            {formData.email && !errors.email && !validateField('email', formData.email) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckIcon className="w-4 h-4 text-success-dark" />
              </div>
            )}
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-error-dark"
            >
              {errors.email}
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
                  : 'border-border-dark focus:border-suit-carta-dark focus:ring-suit-carta-dark/30'
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

          {/* Password Strength */}
          {formData.password && (
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-1 bg-skemino-dark-accent rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${
                    passwordStrength.level === 'weak' ? 'from-error-dark to-error-dark'
                    : passwordStrength.level === 'medium' ? 'from-warning-dark to-warning-dark'
                    : passwordStrength.level === 'good' ? 'from-info-dark to-info-dark'
                    : 'from-success-dark to-success-dark'
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: passwordStrength.level === 'weak' ? '25%'
                    : passwordStrength.level === 'medium' ? '50%'
                    : passwordStrength.level === 'good' ? '75%'
                    : '100%'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className={`text-xs ${passwordStrength.color}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}

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

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">
            Conferma Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <LockClosedIcon className="w-4 h-4 text-text-muted" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
              className={`
                w-full pl-10 pr-10 py-2 bg-skemino-dark-primary border rounded
                text-text-primary placeholder-text-muted text-sm
                focus:outline-none focus:ring-2 transition-colors
                ${errors.confirmPassword
                  ? 'border-error-dark focus:ring-error-dark/30'
                  : formData.confirmPassword && formData.confirmPassword === formData.password
                  ? 'border-success-dark focus:ring-success-dark/30'
                  : 'border-border-dark focus:border-suit-carta-dark focus:ring-suit-carta-dark/30'
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
            {formData.confirmPassword && formData.confirmPassword === formData.password && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <CheckIcon className="w-4 h-4 text-success-dark" />
              </div>
            )}
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-error-dark"
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="space-y-1">
          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
              className="w-3 h-3 mt-0.5 rounded border-border-dark bg-skemino-dark-primary
                       text-suit-carta-dark focus:ring-suit-carta-dark/30 focus:ring-1"
            />
            <span className="text-xs text-text-muted leading-relaxed">
              Accetto i{' '}
              <button
                type="button"
                className="text-suit-carta-dark hover:text-suit-carta-dark/80 underline"
              >
                termini di servizio
              </button>{' '}
              e la{' '}
              <button
                type="button"
                className="text-suit-carta-dark hover:text-suit-carta-dark/80 underline"
              >
                privacy policy
              </button>
            </span>
          </label>
          {errors.agreeTerms && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-error-dark"
            >
              {errors.agreeTerms}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-gradient-to-r from-suit-carta-dark to-suit-carta-dark/80
                   text-white rounded font-medium text-sm
                   hover:from-suit-carta-dark/90 hover:to-suit-carta-dark/70
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
              <span>Registrazione...</span>
            </>
          ) : (
            <span>Crea Account</span>
          )}
        </motion.button>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-xs text-text-muted">
            Hai già un account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-suit-forbici-dark hover:text-suit-forbici-dark/80 font-medium transition-colors"
            >
              Accedi
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};