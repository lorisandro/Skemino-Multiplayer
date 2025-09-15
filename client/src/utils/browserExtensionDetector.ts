/**
 * Browser Extension Interference Detection and Mitigation
 * Detects and handles browser extensions that interfere with fetch requests
 */

export interface ExtensionInterferenceInfo {
  detected: boolean;
  problematicExtensions: string[];
  suggestions: string[];
}

/**
 * Known problematic extension IDs and their patterns
 */
const KNOWN_PROBLEMATIC_EXTENSIONS = [
  'eppiocemhmnlbhjplcgkofciiegomcon', // Extension from the error logs
  'adblockplus',
  'ublock-origin',
  'ghostery',
  'privacy-badger'
];

/**
 * Detects if browser extensions are interfering with network requests
 */
export const detectExtensionInterference = (): ExtensionInterferenceInfo => {
  const result: ExtensionInterferenceInfo = {
    detected: false,
    problematicExtensions: [],
    suggestions: []
  };

  try {
    // Check for extension-specific global variables or modified fetch
    const originalFetch = window.fetch;
    const fetchStringified = originalFetch.toString();

    // Look for signs that fetch has been modified by extensions
    if (fetchStringified.includes('extension') ||
        fetchStringified.includes('chrome-extension') ||
        fetchStringified.includes('moz-extension') ||
        fetchStringified !== 'function fetch() { [native code] }') {
      result.detected = true;
      result.suggestions.push('Fetch API è stata modificata da un\'estensione');
    }

    // Check for known extension interference patterns
    if (typeof window !== 'undefined') {
      // Check for Chrome extension APIs
      if ((window as any).chrome && (window as any).chrome.runtime) {
        result.detected = true;
        result.suggestions.push('Rilevate estensioni Chrome attive');
      }

      // Check for Firefox extension APIs
      if ((window as any).browser && (window as any).browser.runtime) {
        result.detected = true;
        result.suggestions.push('Rilevate estensioni Firefox attive');
      }
    }

    // Add general suggestions if interference is detected
    if (result.detected) {
      result.suggestions = [
        ...result.suggestions,
        'Prova a ricaricare la pagina (F5)',
        'Disabilita temporaneamente le estensioni',
        'Usa una finestra in incognito/privata',
        'Prova un browser diverso'
      ];
    }

  } catch (error) {
    console.warn('Error detecting extension interference:', error);
  }

  return result;
};

/**
 * Tests if network requests are working properly
 */
export const testNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Test with a simple GET request to a reliable endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('data:text/plain,test', {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Network connectivity test failed:', error);
    return false;
  }
};

/**
 * Creates a warning message for extension interference
 */
export const createExtensionWarningMessage = (info: ExtensionInterferenceInfo): string => {
  if (!info.detected) return '';

  let message = 'Rilevata possibile interferenza di estensioni browser.\n\n';

  if (info.problematicExtensions.length > 0) {
    message += `Estensioni problematiche: ${info.problematicExtensions.join(', ')}\n\n`;
  }

  message += 'Soluzioni consigliate:\n';
  info.suggestions.forEach((suggestion, index) => {
    message += `${index + 1}. ${suggestion}\n`;
  });

  return message;
};

/**
 * Monitors for extension interference during app lifecycle
 */
export class ExtensionInterferenceMonitor {
  private listeners: ((info: ExtensionInterferenceInfo) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  startMonitoring(intervalMs: number = 30000) {
    this.intervalId = setInterval(() => {
      const info = detectExtensionInterference();
      if (info.detected) {
        this.notifyListeners(info);
      }
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addListener(callback: (info: ExtensionInterferenceInfo) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (info: ExtensionInterferenceInfo) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(info: ExtensionInterferenceInfo) {
    this.listeners.forEach(listener => {
      try {
        listener(info);
      } catch (error) {
        console.error('Error in extension interference listener:', error);
      }
    });
  }
}

// Global instance for app-wide monitoring
export const extensionMonitor = new ExtensionInterferenceMonitor();