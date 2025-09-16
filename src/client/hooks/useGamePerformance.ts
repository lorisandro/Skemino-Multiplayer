import { useState, useEffect, useRef } from "react";

export const useGamePerformance = () => {
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const measureFPS = (currentTime: number) => {
      frameCount.current++;

      if (currentTime >= lastTime.current + 1000) {
        setFps(
          Math.round(
            (frameCount.current * 1000) / (currentTime - lastTime.current),
          ),
        );
        frameCount.current = 0;
        lastTime.current = currentTime;

        // Measure memory if available
        if ("memory" in performance) {
          const memory = (performance as any).memory;
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1048576));
        }
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return { fps, latency, memoryUsage };
};
