import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@darknes/engine';
import { useEffect } from 'react';

const CHARACTERS: Record<string, { name: string; role: string }> = {
  xyera: { name: 'Xyera', role: 'Boss Lady' },
  elenna: { name: 'Elenna', role: 'Enforcer' },
  keyna: { name: 'Keyna', role: 'Informant' },
  rachel: { name: 'Rachel', role: 'Accountant' },
  henry: { name: 'Henry', role: 'Soldier' },
  azaroth: { name: 'Azaroth', role: 'Rival Boss' },
};

export function CharacterNotification() {
  const { newCharacterNotification, clearNewCharacterNotification } = useGameStore();

  useEffect(() => {
    if (newCharacterNotification) {
      const timer = setTimeout(() => {
        clearNewCharacterNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newCharacterNotification, clearNewCharacterNotification]);

  const char = newCharacterNotification ? CHARACTERS[newCharacterNotification] : null;

  return (
    <AnimatePresence>
      {char && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          onClick={clearNewCharacterNotification}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-64 overflow-hidden rounded-xl border-2 border-red-800/50 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] shadow-[0_0_40px_rgba(139,0,0,0.4)]"
          >
            {/* Red glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent" />

            {/* Header */}
            <div className="relative px-4 pt-4 text-center">
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-red-500">
                New Character
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-[var(--color-ink)]">
                {char.name}
              </h3>
              <p className="text-xs uppercase tracking-wider text-red-400/80">
                {char.role}
              </p>
            </div>

            {/* Character Card Preview */}
            <div className="relative mx-4 my-4 aspect-[3/4] overflow-hidden rounded-lg border border-red-800/30 bg-gradient-to-b from-[var(--color-graphite)] to-black">
              {/* Placeholder silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-display text-red-900/30">
                  {char.name[0]}
                </span>
              </div>
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Character initial on card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-display text-white/10">
                  {char.name[0]}
                </span>
              </div>
            </div>

            {/* Added to collection text */}
            <div className="relative pb-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">
                Added to your collection
              </div>
            </div>

            {/* Close hint */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="text-[9px] text-[var(--color-ink-faint)]">Click anywhere to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
