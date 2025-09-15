import React from 'react';

interface FlagIconProps {
  countryCode?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * FlagIcon - Displays country flag using flag-icons CSS library
 * Falls back to emoji if images fail to load
 */
export const FlagIcon: React.FC<FlagIconProps> = ({
  countryCode,
  size = 'md',
  className = ''
}) => {
  // Size mapping for flag icons
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-6'
  };

  // Get flag URL from flagcdn.com (free flag CDN service)
  const getFlagUrl = (code: string): string => {
    // Using flagcdn.com for high-quality flag images
    return `https://flagcdn.com/${code.toLowerCase()}.svg`;
  };

  // Fallback to emoji if needed
  const getFlagEmoji = (code: string): string => {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (!countryCode || countryCode.length !== 2) {
    // Default world icon for unknown countries
    return (
      <span className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </span>
    );
  }

  const flagUrl = getFlagUrl(countryCode);
  const flagEmoji = getFlagEmoji(countryCode);

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={`Flag of ${countryCode.toUpperCase()}`}
    >
      <img
        src={flagUrl}
        alt={`Flag of ${countryCode.toUpperCase()}`}
        className="w-full h-full object-cover rounded-sm shadow-sm"
        onError={(e) => {
          // Fallback to emoji if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const span = document.createElement('span');
          span.textContent = flagEmoji;
          span.className = 'text-lg';
          target.parentNode?.appendChild(span);
        }}
      />
    </span>
  );
};

export default FlagIcon;