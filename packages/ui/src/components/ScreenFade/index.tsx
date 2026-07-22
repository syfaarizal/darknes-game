import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ScreenFadeProps {
  active: boolean;
  color?: string;
  durationMs?: number;
  onFadeInComplete?: () => void;
  onFadeOutComplete?: () => void;
}

/** A hard, full-screen overlay used for flash cuts and scene-boundary fades. */
export function ScreenFade({
  active,
  color = '#000000',
  durationMs = 400,
  onFadeInComplete,
  onFadeOutComplete,
}: ScreenFadeProps) {
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (active && !wasActiveRef.current) {
      // Fade-in just finished (overlay is now fully visible)
      const timer = setTimeout(() => onFadeInComplete?.(), durationMs);
      wasActiveRef.current = true;
      return () => clearTimeout(timer);
    } else if (!active && wasActiveRef.current) {
      // Fade-out just finished (overlay is now invisible, about to be unmounted)
      const timer = setTimeout(() => onFadeOutComplete?.(), 50);
      wasActiveRef.current = false;
      return () => clearTimeout(timer);
    }
    wasActiveRef.current = active;
  }, [active, durationMs, onFadeInComplete, onFadeOutComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durationMs / 1000 }}
          className="pointer-events-none absolute inset-0 z-50"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}
