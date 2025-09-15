import React from 'react';

interface FlagIconProps {
  countryCode?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * FlagIcon - Displays country flag emoji based on country code
 * Uses Unicode flag emojis for clean display across platforms
 */
export const FlagIcon: React.FC<FlagIconProps> = ({
  countryCode,
  size = 'md',
  className = ''
}) => {
  // Country code to flag emoji mapping
  const getFlagEmoji = (code?: string): string => {
    if (!code || code.length !== 2) return '🌍'; // Globe for unknown/missing countries

    const flagMap: Record<string, string> = {
      'IT': '🇮🇹', // Italy
      'US': '🇺🇸', // United States
      'FR': '🇫🇷', // France
      'DE': '🇩🇪', // Germany
      'ES': '🇪🇸', // Spain
      'GB': '🇬🇧', // United Kingdom
      'CA': '🇨🇦', // Canada
      'AU': '🇦🇺', // Australia
      'BR': '🇧🇷', // Brazil
      'AR': '🇦🇷', // Argentina
      'MX': '🇲🇽', // Mexico
      'JP': '🇯🇵', // Japan
      'KR': '🇰🇷', // South Korea
      'CN': '🇨🇳', // China
      'RU': '🇷🇺', // Russia
      'IN': '🇮🇳', // India
      'NL': '🇳🇱', // Netherlands
      'BE': '🇧🇪', // Belgium
      'CH': '🇨🇭', // Switzerland
      'AT': '🇦🇹', // Austria
      'SE': '🇸🇪', // Sweden
      'NO': '🇳🇴', // Norway
      'DK': '🇩🇰', // Denmark
      'FI': '🇫🇮', // Finland
      'PL': '🇵🇱', // Poland
      'CZ': '🇨🇿', // Czech Republic
      'PT': '🇵🇹', // Portugal
      'GR': '🇬🇷', // Greece
      'TR': '🇹🇷', // Turkey
      'IL': '🇮🇱', // Israel
      'EG': '🇪🇬', // Egypt
      'ZA': '🇿🇦', // South Africa
      'NG': '🇳🇬', // Nigeria
      'KE': '🇰🇪', // Kenya
      'MA': '🇲🇦', // Morocco
      'TN': '🇹🇳', // Tunisia
      'DZ': '🇩🇿', // Algeria
      'LY': '🇱🇾', // Libya
      'SA': '🇸🇦', // Saudi Arabia
      'AE': '🇦🇪', // UAE
      'QA': '🇶🇦', // Qatar
      'KW': '🇰🇼', // Kuwait
      'BH': '🇧🇭', // Bahrain
      'OM': '🇴🇲', // Oman
      'JO': '🇯🇴', // Jordan
      'LB': '🇱🇧', // Lebanon
      'SY': '🇸🇾', // Syria
      'IQ': '🇮🇶', // Iraq
      'IR': '🇮🇷', // Iran
      'AF': '🇦🇫', // Afghanistan
      'PK': '🇵🇰', // Pakistan
      'BD': '🇧🇩', // Bangladesh
      'LK': '🇱🇰', // Sri Lanka
      'MM': '🇲🇲', // Myanmar
      'TH': '🇹🇭', // Thailand
      'VN': '🇻🇳', // Vietnam
      'KH': '🇰🇭', // Cambodia
      'LA': '🇱🇦', // Laos
      'MY': '🇲🇾', // Malaysia
      'SG': '🇸🇬', // Singapore
      'ID': '🇮🇩', // Indonesia
      'PH': '🇵🇭', // Philippines
      'TW': '🇹🇼', // Taiwan
      'HK': '🇭🇰', // Hong Kong
      'MO': '🇲🇴', // Macau
      'NZ': '🇳🇿', // New Zealand
      'FJ': '🇫🇯', // Fiji
      'PG': '🇵🇬', // Papua New Guinea
      'TO': '🇹🇴', // Tonga
      'WS': '🇼🇸', // Samoa
      'VU': '🇻🇺', // Vanuatu
      'SB': '🇸🇧', // Solomon Islands
      'NC': '🇳🇨', // New Caledonia
      'PF': '🇵🇫', // French Polynesia
    };

    return flagMap[code.toUpperCase()] || '🌍';
  };

  // Size mapping for consistent sizing
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const flag = getFlagEmoji(countryCode);

  return (
    <span
      className={`inline-block ${sizeClasses[size]} ${className}`}
      title={countryCode ? `${countryCode.toUpperCase()}` : 'Unknown Country'}
      role="img"
      aria-label={countryCode ? `Flag of ${countryCode.toUpperCase()}` : 'Unknown country flag'}
    >
      {flag}
    </span>
  );
};

export default FlagIcon;