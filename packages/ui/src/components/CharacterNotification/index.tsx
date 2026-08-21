import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@darknes/engine';

const CHARACTERS: Record<string, { name: string; role: string; image: string }> = {
  xyera: { name: 'Xyera', role: 'Boss Lady', image: '/assets/cards/xyera-id-card.webp' },
  elenna: { name: 'Elenna', role: 'Enforcer', image: '/assets/cards/elenna-id-card.webp' },
  keyna: { name: 'Keyna', role: 'Informant', image: '/assets/cards/keyna-id-card.webp' },
  rachel: { name: 'Rachel', role: 'Accountant', image: '/assets/cards/rachel.webp' },
  henry: { name: 'Henry', role: 'Soldier', image: '/assets/cards/henry.webp' },
  azaroth: { name: 'Azaroth', role: 'Rival Boss', image: '/assets/cards/azaroth.webp' },
};

// Audio notification sound
const NOTIF_SFX = new Audio('/assets/audio/sfx/notif-sfx.wav');

export function CharacterNotification() {
  const { newCharacterNotification, clearNewCharacterNotification } = useGameStore();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const hasPlayedSound = useRef(false);

  const char = newCharacterNotification ? CHARACTERS[newCharacterNotification] : null;

  // Play notification sound when character appears
  useEffect(() => {
    if (char && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      NOTIF_SFX.currentTime = 0;
      NOTIF_SFX.volume = 0.5;
      NOTIF_SFX.play().catch(() => {
        // Ignore autoplay errors
      });
    }
    // Reset when notification closes
    if (!char) {
      hasPlayedSound.current = false;
    }
  }, [char]);

  // Aggressive mouse tracking for dramatic tilt
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 35 degrees max - aggressive but not extreme
    const rotateY = ((mouseX - centerX) / centerX) * 35;
    const rotateX = -((mouseY - centerY) / centerY) * 35;

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
          transition={{ duration: 0.2 }}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.15)' }}
          onClick={clearNewCharacterNotification}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 60 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
            }}
            exit={{ scale: 0.5, opacity: 0, y: 60 }}
            transition={{
              rotateX: { type: 'spring', stiffness: 80, damping: 12 },
              rotateY: { type: 'spring', stiffness: 80, damping: 12 },
              scale: { type: 'spring', stiffness: 150, damping: 15 },
            }}
            style={{ perspective: 700 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-72 cursor-pointer overflow-hidden rounded-2xl border border-red-900/60 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] shadow-[0_0_100px_rgba(139,0,0,0.5),0_30px_60px_-15px_rgba(0,0,0,0.8)]"
          >
            {/* Animated pulsing glow */}
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border-2 border-red-600/40"
              style={{ boxShadow: '0 0 40px rgba(139,0,0,0.5), inset 0 0 30px rgba(139,0,0,0.2)' }}
            />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_50px_rgba(139,0,0,0.25)]" />

            {/* Content */}
            <div className="relative px-6 pt-8 pb-5">
              {/* Badge */}
              <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-4 text-center"
              >
                <span className="inline-block rounded-full border-2 border-red-800/60 bg-red-900/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
                  ✦ New Character ✦
                </span>
              </motion.div>

              {/* Character Card Preview - Bigger */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="relative mx-auto mb-5 aspect-[3/4] w-full overflow-hidden rounded-xl border border-red-900/50 bg-black shadow-inner"
                style={{
                  transform: `rotateX(${tilt.rotateX * 0.3}deg) scale(1.03)`,
                  boxShadow: 'inset 0 0 60px rgba(139,0,0,0.35)',
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Inner glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(139,0,0,0.35)]" />
              </motion.div>

              {/* Character Info */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center"
              >
                <h3 className="font-display text-3xl uppercase tracking-wider text-white drop-shadow-lg">
                  {char.name}
                </h3>
                <p className="mt-1.5 text-xs uppercase tracking-[0.15em] text-red-400/80">
                  {char.role}
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2 }}
                className="my-5 h-px bg-gradient-to-r from-transparent via-red-800/60 to-transparent"
              />

              {/* Collection text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-center text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]"
              >
                Added to your collection
              </motion.p>
            </div>

            {/* Click hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-2 left-0 right-0 text-center"
            >
              <span className="text-[9px] text-[var(--color-ink-faint)]">
                Tap anywhere to continue
              </span>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-red-800/50" />
            <div className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-red-800/50" />
            <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-red-800/50" />
            <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-red-800/50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
