import { useState, useEffect, useRef } from 'react';

interface GamePerformanceMetrics {
  fps: number;
  frameTime: number;
  isOptimal: boolean;
  renderTime: number;
  memoryUsage?: number;
}

/**
 * Hook for monitoring gaming performance metrics
 * Tracks FPS, frame time, and rendering performance for competitive Skèmino gaming
 */
export function useGamePerformance(): GamePerformanceMetrics {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.67);
  const [renderTime, setRenderTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState<number>();

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsArrayRef = useRef<number[]>([]);
  const renderStartRef = useRef(0);

  useEffect(() => {
    let animationFrame: number;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // Calculate FPS every 60 frames for smooth updates
      if (frameCountRef.current >= 60) {
        const currentFps = Math.round(1000 / (delta / 60));
        fpsArrayRef.current.push(currentFps);

        // Keep last 10 measurements for averaging
        if (fpsArrayRef.current.length > 10) {
          fpsArrayRef.current.shift();
        }

        // Calculate average FPS
        const avgFps = Math.round(
          fpsArrayRef.current.reduce((sum, fps) => sum + fps, 0) / fpsArrayRef.current.length
        );

        setFps(avgFps);
        setFrameTime(1000 / avgFps);

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Measure render time
      if (renderStartRef.current > 0) {
        const renderDuration = now - renderStartRef.current;
        setRenderTime(renderDuration);
        renderStartRef.current = 0;
      }

      animationFrame = requestAnimationFrame(measurePerformance);
    };

    // Start render time measurement
    const startRenderMeasurement = () => {
      renderStartRef.current = performance.now();
    };

    // Memory usage (if available)
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize) {
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1024 / 1024)); // MB
        }
      }
    };

    // Start performance monitoring
    animationFrame = requestAnimationFrame(measurePerformance);

    // Update memory usage every 5 seconds
    const memoryInterval = setInterval(updateMemoryUsage, 5000);
    updateMemoryUsage(); // Initial measurement

    // Add render start measurement to RAF
    const observer = new MutationObserver(startRenderMeasurement);
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      clearInterval(memoryInterval);
      observer.disconnect();
    };
  }, []);

  const isOptimal = fps >= 55 && frameTime <= 18; // Allow small margin for optimal performance

  return {
    fps,
    frameTime,
    isOptimal,
    renderTime,
    memoryUsage,
  };
}

/**
 * Hook for performance warnings
 * Alerts when performance drops below gaming standards
 */
export function usePerformanceWarnings() {
  const { fps, isOptimal, frameTime } = useGamePerformance();
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const newWarnings: string[] = [];

    if (fps < 50) {
      newWarnings.push(`Low FPS: ${fps} (target: 60+)`);
    }

    if (frameTime > 20) {
      newWarnings.push(`High frame time: ${frameTime.toFixed(1)}ms (target: <16.67ms)`);
    }

    if (!isOptimal) {
      newWarnings.push('Performance below gaming optimal');
    }

    setWarnings(newWarnings);
  }, [fps, frameTime, isOptimal]);

  return {
    hasWarnings: warnings.length > 0,
    warnings,
    isOptimal,
  };
}

/**
 * Performance monitoring utilities
 */
export const PerformanceUtils = {
  /**
   * Optimize element for gaming performance
   */
  optimizeElement: (element: HTMLElement) => {
    element.style.willChange = 'transform';
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.contain = 'layout style paint';
  },

  /**
   * Clean up performance optimizations
   */
  cleanupOptimizations: (element: HTMLElement) => {
    element.style.willChange = 'auto';
    element.style.transform = '';
    element.style.backfaceVisibility = '';
    element.style.contain = '';
  },

  /**
   * Get optimal board size based on performance with 2K support
   */
  getOptimalBoardSize: (containerWidth: number, containerHeight: number, targetFps = 60) => {
    // Enhanced base size calculation for 2K displays
    let baseSize: number;

    if (containerWidth >= 1920) {
      // 2K+ displays - significantly larger base sizes
      baseSize = Math.min(
        containerWidth * 0.75,
        containerHeight * 0.85,
        containerWidth >= 2560 ? 1800 : 1600 // Increased max sizes for better 2K experience
      );
    } else {
      // Standard displays
      baseSize = Math.min(containerWidth * 0.7, containerHeight * 0.75, 1200);
    }

    // Performance-based adjustments (less aggressive for modern hardware)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory && memory.usedJSHeapSize > 300 * 1024 * 1024) { // Further increased threshold to 300MB for 2K
        baseSize = Math.min(baseSize, containerWidth >= 1920 ? 1400 : 1000);
      }
    }

    return baseSize;
  },
};