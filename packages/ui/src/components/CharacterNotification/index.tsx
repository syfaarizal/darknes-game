import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@darknes/engine';

const CHARACTERS: Record<string, { name: string; role: string; image: string }> = {
  xyera: { name: 'Xyera', role: 'Companion', image: '/assets/cards/xyera-id-card.webp' },
  elenna: { name: 'Elenna', role: 'Childhood Friend', image: '/assets/cards/elenna-id-card.webp' },
  keyna: { name: 'Keyna', role: 'Business Partner', image: '/assets/cards/keyna-id-card.webp' },
  rachel: { name: 'Rachel', role: 'Little Sister', image: '/assets/cards/rachel-id-card.webp' },
  henry: { name: 'Henry', role: 'Little Brother', image: '/assets/cards/henry-id-card.webp' },
  azaroth: { name: 'Azaroth', role: 'Main Antagonist', image: '/assets/cards/azaroth-id-card.webp' },
  victor: { name: 'Victor', role: 'Business Associate', image: '/assets/cards/victor-id-card.webp' },
  samuel: { name: 'Samuel Ravenscroft', role: 'Player Father', image: '/assets/cards/samuel-id-card.webp' },
  mother: { name: 'Ravenscroft Mother', role: 'Player Mother', image: '/assets/cards/mother-id-card.webp' },
  
};

// Audio notification sound
const NOTIF_SFX = new Audio('/assets/audio/sfx/notif-sfx.wav');
const FLIP_SFX = new Audio('/assets/audio/sfx/flipcard-sfx.mp3');

// Back face component - shared with Gallery
function CardBackFace({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-[inherit] border border-red-700/40 bg-black [backface-visibility:hidden] [transform:rotateY(180deg)] ${className}`}
      style={{ boxShadow: 'inset 0 0 30px rgba(139,0,0,0.4), 0 0 20px rgba(139,0,0,0.25)' }}
    >
      {/* Back artwork */}
      <img
        src="/assets/cards/darknes-back-card.webp"
        alt="Card back"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Subtle red vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-red-900/20" />

      {/* Corner decorations - slightly rounded */}
      <div className="absolute left-1.5 top-1.5 h-2.5 w-2.5 rounded-sm border-l border-t border-red-700/60" />
      <div className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-sm border-r border-t border-red-700/60" />
      <div className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-sm border-b border-l border-red-700/60" />
      <div className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-sm border-b border-r border-red-700/60" />

      {/* Wordmark */}
      <div className="absolute inset-x-0 bottom-3 text-center">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-red-500/70 drop-shadow-[0_0_8px_rgba(139,0,0,0.6)]">
          ✦ Darknes ✦
        </span>
      </div>
    </div>
  );
}

export function CharacterNotification() {
  const { newCharacterNotification, clearNewCharacterNotification } = useGameStore();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
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
    setIsFlipped(false);
  }, []);

  // Reset flip when modal closes
  useEffect(() => {
    if (!char) {
      setIsFlipped(false);
    }
  }, [char]);

  // Play flip sound
  const prevFlipped = useRef(false);
  useEffect(() => {
    if (isFlipped !== prevFlipped.current) {
      FLIP_SFX.currentTime = 0;
      FLIP_SFX.volume = 0.4;
      FLIP_SFX.play().catch(() => {});
      prevFlipped.current = isFlipped;
    }
  }, [isFlipped]);

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
          {/* Outer card with 3D tilt */}
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
            style={{ perspective: 700, transformStyle: 'preserve-3d' }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            className="relative aspect-[9/16] w-[300px] cursor-pointer [transform-style:preserve-3d]"
          >
            {/* Inner flip card */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 110, damping: 18 }}
              className="relative h-full [transform-style:preserve-3d]"
            >
              {/* Card content — FRONT FACE */}
              <div className="relative h-full overflow-hidden rounded-lg border border-red-900/30 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] [backface-visibility:hidden]">
                {/* Badge */}
                <motion.div
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute right-1.5 top-1.5 z-10 shrink-0 rounded border border-red-800/60 bg-red-900/40 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-red-400"
                >
                  ✦ New ✦
                </motion.div>

                {/* Character Image - fit perfectly */}
                <img
                  src={char.image}
                  alt={char.name}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />

                {/* Fallback initial */}
                <div
                  className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)]"
                  style={{ display: 'none' }}
                >
                  <span className="text-4xl font-display text-white/10">
                    {char.name[0]}
                  </span>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="font-display text-xs uppercase tracking-wide text-white drop-shadow-md">
                    {char.name}
                  </h3>
                  <p className="text-[9px] uppercase tracking-wider text-red-400/70">
                    {char.role}
                  </p>
                </div>
              </div>

              {/* BACK FACE */}
              <CardBackFace className="rounded-lg" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
