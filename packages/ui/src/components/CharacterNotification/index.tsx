import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@darknes/engine';

const CHARACTERS: Record<string, { name: string; role: string; image: string }> = {
  xyera: { name: 'Xyera', role: 'Boss Lady', image: '/assets/cards/xyera.webp' },
  elenna: { name: 'Elenna', role: 'Enforcer', image: '/assets/cards/elenna-id-card.webp' },
  keyna: { name: 'Keyna', role: 'Informant', image: '/assets/cards/keyna.webp' },
  rachel: { name: 'Rachel', role: 'Accountant', image: '/assets/cards/rachel.webp' },
  henry: { name: 'Henry', role: 'Soldier', image: '/assets/cards/henry.webp' },
  azaroth: { name: 'Azaroth', role: 'Rival Boss', image: '/assets/cards/azaroth.webp' },
};

export function CharacterNotification() {
  const { newCharacterNotification, clearNewCharacterNotification } = useGameStore();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const char = newCharacterNotification ? CHARACTERS[newCharacterNotification] : null;

  // Aggressive mouse tracking for dramatic tilt
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // More dramatic rotation - up to 25 degrees
    const rotateY = ((mouseX - centerX) / centerX) * 25;
    const rotateX = -((mouseY - centerY) / centerY) * 25;

    setTilt({ rotateX, rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <AnimatePresence>
      {char && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.15)' }}
          onClick={clearNewCharacterNotification}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
            }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            // Slower, more dramatic spring
            transition={{
              rotateX: { type: 'spring', stiffness: 100, damping: 15 },
              rotateY: { type: 'spring', stiffness: 100, damping: 15 },
              scale: { type: 'spring', stiffness: 200, damping: 20 },
              opacity: { duration: 0.3 },
            }}
            style={{ perspective: 800 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-56 cursor-pointer overflow-hidden rounded-2xl border border-red-900/60 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] shadow-[0_0_80px_rgba(139,0,0,0.4),0_25px_50px_-12px_rgba(0,0,0,0.8)]"
          >
            {/* Animated red glow border */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border border-red-600/30"
              style={{ boxShadow: '0 0 30px rgba(139,0,0,0.4)' }}
            />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(139,0,0,0.2)]" />

            {/* Content */}
            <div className="relative px-5 pt-6 pb-4">
              {/* Badge */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mb-3 text-center"
              >
                <span className="inline-block rounded-full border border-red-800/50 bg-red-900/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                  ✦ New Character ✦
                </span>
              </motion.div>

              {/* Character Card Preview with aggressive tilt */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative mx-auto mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl border border-red-900/40 bg-black shadow-inner"
                style={{
                  transform: `rotateX(${tilt.rotateX * 0.3}deg) scale(1.02)`,
                  boxShadow: 'inset 0 0 50px rgba(139,0,0,0.3)',
                }}
              >
                {/* Character Image */}
                <img
                  src={char.image}
                  alt={char.name}
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />

                {/* Fallback initial */}
                <div
                  className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-b from-[var(--color-graphite)] to-black"
                  style={{ display: 'none' }}
                >
                  <span className="text-8xl font-display text-red-900/40">
                    {char.name[0]}
                  </span>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Inner glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(139,0,0,0.3)]" />
              </motion.div>

              {/* Character Info */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="font-display text-2xl uppercase tracking-wider text-white drop-shadow-lg">
                  {char.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-red-400/80">
                  {char.role}
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.25 }}
                className="my-4 h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent"
              />

              {/* Collection text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]"
              >
                Added to your collection
              </motion.p>
            </div>

            {/* Click hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-2 left-0 right-0 text-center"
            >
              <span className="text-[9px] text-[var(--color-ink-faint)]">
                Tap anywhere to continue
              </span>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-red-800/40" />
            <div className="absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-red-800/40" />
            <div className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-red-800/40" />
            <div className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-red-800/40" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
