import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { IconButton } from '@darknes/ui';
import { useGameStore } from '@darknes/engine';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_CHARACTERS = [
  { id: 'xyera', name: 'Xyera', role: 'Boss Lady', rarity: 'legendary', accent: '#dc2626', image: '/assets/cards/xyera-id-card.webp' },
  { id: 'elenna', name: 'Elenna', role: 'Enforcer', rarity: 'epic', accent: '#9333ea', image: '/assets/cards/elenna-id-card.webp' },
  { id: 'keyna', name: 'Keyna', role: 'Informant', rarity: 'rare', accent: '#2563eb', image: '/assets/cards/keyna-id-card.webp' },
  { id: 'rachel', name: 'Rachel', role: 'Accountant', rarity: 'rare', accent: '#0891b2', image: '/assets/cards/rachel-id-card.webp' },
  { id: 'henry', name: 'Henry', role: 'Soldier', rarity: 'common', accent: '#64748b', image: '/assets/cards/henry-id-card.webp' },
  { id: 'azaroth', name: 'Azaroth', role: 'Rival Boss', rarity: 'legendary', accent: '#dc2626', image: '/assets/cards/azaroth-id-card.webp' },
];

const RARITY_INFO: Record<string, { label: string; color: string; bg: string }> = {
  legendary: { label: 'Legendary', color: 'text-red-400', bg: 'bg-red-900/30 border-red-800/40' },
  epic: { label: 'Epic', color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-800/40' },
  rare: { label: 'Rare', color: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-800/40' },
  common: { label: 'Common', color: 'text-gray-400', bg: 'bg-gray-900/30 border-gray-700/40' },
};

export function Gallery() {
  const navigate = useNavigate();
  const collectedCharacters = useGameStore((s) => s.collectedCharacters);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter collected characters
  const collectedChars = ALL_CHARACTERS.filter((c) =>
    collectedCharacters.includes(c.id)
  );

  // Mouse tracking for aggressive tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectedCard && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Maximum 35 degrees rotation - aggressive but not too extreme
      const rotateY = ((mouseX - centerX) / centerX) * 35;
      const rotateX = -((mouseY - centerY) / centerY) * 35;

      setTilt({ rotateX, rotateY });
    }
  }, [selectedCard]);

  // Reset tilt when card is closed
  useEffect(() => {
    if (!selectedCard) {
      setTilt({ rotateX: 0, rotateY: 0 });
    }
  }, [selectedCard]);

  // Get selected character data
  const selectedChar = selectedCard
    ? ALL_CHARACTERS.find((c) => c.id === selectedCard)
    : null;

  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--color-void)] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-red-900/20 bg-gradient-to-b from-[var(--color-graphite)]/80 to-transparent backdrop-blur-md">
        <div className="flex items-center gap-4 px-4 py-3">
          <IconButton
            icon={<ArrowLeft size={18} />}
            label="Back"
            onClick={() => navigate(-1)}
          />
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-red-500" />
            <h2 className="font-display text-base uppercase tracking-widest text-[var(--color-ink)]">
              Collection
            </h2>
          </div>
          <span className="ml-auto rounded-full border border-red-900/30 bg-red-900/10 px-3 py-1 text-xs text-red-400/80">
            {collectedChars.length} / {ALL_CHARACTERS.length}
          </span>
        </div>
      </header>

      {/* Content */}
      <main ref={containerRef} className="flex-1 overflow-auto p-4">
        {/* Empty State */}
        {collectedChars.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 text-6xl text-red-900/30"
            >
              <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/>
              </svg>
            </motion.div>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-2 text-sm uppercase tracking-wider text-[var(--color-ink-muted)]"
            >
              No Characters Collected
            </motion.p>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-[var(--color-ink-faint)]"
            >
              Meet characters in the story to add them here
            </motion.p>
          </div>
        ) : (
          /* Grid of cards */
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {collectedChars.map((char, index) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCard(char.id)}
              >
                {/* Card */}
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-lg border border-red-900/30 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] transition-all duration-200 hover:border-red-800/50 hover:shadow-[0_0_20px_rgba(139,0,0,0.2)] active:scale-95"
                >
                  {/* Character Image */}
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
                    className="absolute inset-0 hidden items-center justify-center bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)]"
                    style={{ display: 'none' }}
                  >
                    <span className="text-4xl font-display text-white/10">
                      {char.name[0]}
                    </span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Rarity badge */}
                  <div className={`absolute right-1.5 top-1.5 rounded border px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider ${RARITY_INFO[char.rarity]?.color ?? RARITY_INFO.common.color} ${RARITY_INFO[char.rarity]?.bg ?? RARITY_INFO.common.bg}`}>
                    {char.rarity}
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="font-display text-xs uppercase tracking-wide text-white drop-shadow-md">
                      {char.name}
                    </h3>
                    <p className="text-[9px] uppercase tracking-wider text-red-400/70">
                      {char.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-red-900/10 px-4 py-2 text-center">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
          {collectedChars.length === 0
            ? 'Explore the story to discover characters'
            : `Tap a card to view details`}
        </span>
      </footer>

      {/* Zoomed Card Modal with Aggressive Tilt */}
      <AnimatePresence>
        {selectedChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.15)' }}
            onClick={() => setSelectedCard(null)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
          >
            {/* Card with extreme 3D tilt */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{
                rotateX: { type: 'spring', stiffness: 80, damping: 12 },
                rotateY: { type: 'spring', stiffness: 80, damping: 12 },
                scale: { type: 'spring', stiffness: 180, damping: 18 },
              }}
              style={{ perspective: 700 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-80 cursor-pointer overflow-hidden rounded-2xl border-2 border-red-900/50 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] shadow-[0_0_100px_rgba(139,0,0,0.5),0_30px_60px_-15px_rgba(0,0,0,0.7)]"
            >
              {/* Strong glow effect */}
              <div
                className="absolute inset-0 opacity-20 blur-3xl"
                style={{ backgroundColor: selectedChar.accent }}
              />

              {/* Card content */}
              <div className="relative p-6">
                {/* Rarity badge */}
                <div className={`absolute right-5 top-5 z-10 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${RARITY_INFO[selectedChar.rarity]?.color ?? ''} ${RARITY_INFO[selectedChar.rarity]?.bg ?? ''}`}>
                  {RARITY_INFO[selectedChar.rarity]?.label ?? selectedChar.rarity}
                </div>

                {/* Character image area */}
                <div
                  className="relative mx-auto mb-5 aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-inner"
                  style={{
                    boxShadow: `inset 0 0 80px ${selectedChar.accent}44`,
                    transform: `rotateX(${tilt.rotateX * 0.4}deg) scale(1.08)`,
                  }}
                >
                  {/* Character Image */}
                  <img
                    src={selectedChar.image}
                    alt={selectedChar.name}
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
                    <span
                      className="text-9xl font-display text-white/5"
                      style={{ color: selectedChar.accent }}
                    >
                      {selectedChar.name[0]}
                    </span>
                  </div>

                  {/* Overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Dynamic glowing border */}
                  <motion.div
                    animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.03, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: `3px solid ${selectedChar.accent}70`,
                      boxShadow: `0 0 30px ${selectedChar.accent}50, inset 0 0 30px ${selectedChar.accent}20`,
                    }}
                  />
                </div>

                {/* Character info */}
                <div className="text-center">
                  <motion.h3
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="font-display text-4xl uppercase tracking-widest text-white drop-shadow-lg"
                  >
                    {selectedChar.name}
                  </motion.h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-red-400/80">
                    {selectedChar.role}
                  </p>
                </div>

                {/* Decorative line */}
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-red-800/60 to-transparent" />

                {/* Status */}
                <p className="text-center text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                  ✦ Collected ✦
                </p>
              </div>

              {/* Corner decorations */}
              <div className="absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-red-700/50" />
              <div className="absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-red-700/50" />
              <div className="absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-red-700/50" />
              <div className="absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-red-700/50" />

              {/* Pulsing close hint */}
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute bottom-3 left-0 right-0 text-center"
              >
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-ink-faint)]">
                  Tap anywhere to close
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
