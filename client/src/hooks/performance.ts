import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  isOptimal: boolean;
  cpuUsage?: number;
  renderTime: number;
}

interface UseGamePerformanceReturn extends PerformanceMetrics {
  startMeasuring: () => void;
  stopMeasuring: () => void;
  isMonitoring: boolean;
}

/**
 * Performance utilities for game optimization
 */
export const PerformanceUtils = {
  /**
   * Calculate optimal board size based on viewport and performance for enhanced scaling
   */
  getOptimalBoardSize: (viewportWidth: number, viewportHeight: number, currentFps: number): number => {
    const baseSize = Math.min(viewportWidth * 0.8, viewportHeight * 0.85);

    // Enhanced size scaling for larger displays
    let scaleFactor = 1;
    if (viewportWidth > 2560) {
      scaleFactor = 0.7; // Conservative for ultra-wide displays
    } else if (viewportWidth > 1920) {
      scaleFactor = 0.85; // Moderate scaling for large displays
    }

    const adjustedBaseSize = baseSize * scaleFactor;

    // Performance-based adjustments with larger board support
    if (currentFps < 30) {
      return Math.min(adjustedBaseSize * 0.7, 1000); // Increased minimum for poor performance
    } else if (currentFps < 45) {
      return Math.min(adjustedBaseSize * 0.85, 1400); // Better support for sub-optimal performance
    } else if (currentFps >= 60) {
      return Math.min(adjustedBaseSize, 2000); // Maximum size for optimal performance
    }

    return Math.min(adjustedBaseSize, 1600); // Default enhanced size
  },

  /**
   * Get memory usage if available
   */
  getMemoryUsage: (): number | undefined => {
    if ('memory' in performance && (performance as any).memory) {
      return Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
    }
    return undefined;
  },

  /**
   * Check if device is low-end
   */
  isLowEndDevice: (): boolean => {
    const memory = PerformanceUtils.getMemoryUsage();
    const cores = navigator.hardwareConcurrency || 2;

    return (memory !== undefined && memory < 100) || cores < 4;
  }
};

/**
 * Hook for monitoring game performance
 */
export const useGamePerformance = (): UseGamePerformanceReturn => {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.67);
  const [memoryUsage, setMemoryUsage] = useState<number | undefined>(undefined);
  const [isOptimal, setIsOptimal] = useState(true);
  const [cpuUsage, setCpuUsage] = useState<number | undefined>(undefined);
  const [renderTime, setRenderTime] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // FPS calculation variables
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());
  const [animationId, setAnimationId] = useState<number | null>(null);

  // FPS measurement function
  const measureFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= 1000) { // Update every second
      const currentFps = Math.round((frameCount * 1000) / deltaTime);
      const currentFrameTime = deltaTime / frameCount;

      setFps(currentFps);
      setFrameTime(currentFrameTime);
      setFrameCount(0);
      setLastTime(currentTime);

      // Update optimal flag
      setIsOptimal(currentFps >= 55 && currentFrameTime <= 18);
    } else {
      setFrameCount(prev => prev + 1);
    }

    if (isMonitoring) {
      const id = requestAnimationFrame(measureFPS);
      setAnimationId(id);
    }
  }, [frameCount, lastTime, isMonitoring]);

  // Start measuring performance
  const startMeasuring = useCallback(() => {
    if (!isMonitoring) {
      setIsMonitoring(true);
      setLastTime(performance.now());
      setFrameCount(0);
    }
  }, [isMonitoring]);

  // Stop measuring performance
  const stopMeasuring = useCallback(() => {
    if (isMonitoring) {
      setIsMonitoring(false);
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }
    }
  }, [isMonitoring, animationId]);

  // Start measuring on mount
  useEffect(() => {
    startMeasuring();
    return () => stopMeasuring();
  }, [startMeasuring, stopMeasuring]);

  // Run FPS measurement
  useEffect(() => {
    if (isMonitoring && !animationId) {
      const id = requestAnimationFrame(measureFPS);
      setAnimationId(id);
    }
  }, [isMonitoring, measureFPS, animationId]);

  return {
    fps,
    frameTime,
    memoryUsage,
    isOptimal,
    cpuUsage,
    renderTime,
    startMeasuring,
    stopMeasuring,
    isMonitoring,
  };
};