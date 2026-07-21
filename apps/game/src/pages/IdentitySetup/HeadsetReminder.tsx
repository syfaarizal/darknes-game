import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeadsetReminderProps {
  onSkip: () => void;
}

// Custom headset SVG icon
function HeadsetIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--color-accent-strong)]"
    >
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
      <rect x="1" y="14" width="4" height="6" rx="2" />
      <rect x="19" y="14" width="4" height="6" rx="2" />
      <path d="M6 16.5a1 1 0 0 1 1-1 1.5 1.5 0 0 1 0 2.5" strokeWidth="1" opacity="0.5" />
      <path d="M18 16.5a1 1 0 0 0-1-1 1.5 1.5 0 0 0 0 2.5" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function HeadsetReminder({ onSkip }: HeadsetReminderProps) {
  // Auto-advance after 5 seconds
  useEffect(() => {
    const timer = window.setTimeout(onSkip, 5000);
    return () => window.clearTimeout(timer);
  }, [onSkip]);

  return (
    <motion.div
      key="headset-reminder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSkip}
      className="relative flex h-[20rem] w-full cursor-pointer flex-col items-center justify-center overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label="Lanjutkan"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSkip();
        }
      }}
    >
      {/* Ambient background rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Outer ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
            className="absolute rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5"
            style={{ width: 220, height: 220 }}
          />
          {/* Inner ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 3.0, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', delay: 0.3 }}
            className="absolute rounded-full border border-[var(--color-accent-strong)]/30 bg-[var(--color-accent-strong)]/8"
            style={{ width: 156, height: 156 }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Headset icon with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.0, ease: [0.34, 1.56, 0.64, 1], repeat: Infinity, repeatType: 'loop' }}
            className="relative flex items-center justify-center"
          >
            {/* Soft glow behind icon */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
              className="absolute rounded-full bg-[var(--color-accent)]/12 blur-2xl"
              style={{ width: 110, height: 110 }}
            />
            <HeadsetIcon />
          </motion.div>
        </motion.div>

        {/* Main message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md font-body text-base leading-relaxed text-[var(--color-ink)]"
        >
          Gunakan headset untuk pengalaman lebih baik
        </motion.p>
      </div>
    </motion.div>
  );
}
