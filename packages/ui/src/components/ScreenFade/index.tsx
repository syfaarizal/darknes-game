import { AnimatePresence, motion } from 'framer-motion';

export interface ScreenFadeProps {
  active: boolean;
  color?: string;
  durationMs?: number;
}

/** A hard, full-screen overlay used for flash cuts and scene-boundary fades. */
export function ScreenFade({ active, color = '#000000', durationMs = 400 }: ScreenFadeProps) {
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
