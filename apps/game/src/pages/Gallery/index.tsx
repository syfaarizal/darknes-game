import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { IconButton } from '@darknes/ui';
import { useGameStore } from '@darknes/engine';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_CHARACTERS = [
  {id: 'xyera', name: 'Xyera', role: 'Companion', rarity: 'legendary', accent: '#dc2626', image: '/assets/cards/xyera-id-card.webp'},
  {id: 'elenna', name: 'Elenna', role: 'Childhood Friend', rarity: 'epic', accent: '#9333ea', image: '/assets/cards/elenna-id-card.webp'},
  {id: 'keyna', name: 'Keyna', role: 'Business Partner', rarity: 'epic', accent: '#2563eb', image: '/assets/cards/keyna-id-card.webp'},
  {id: 'rachel', name: 'Rachel', role: 'Little Sister', rarity: 'common', accent: '#0891b2', image: '/assets/cards/rachel-id-card.webp'},
  {id: 'henry', name: 'Henry', role: 'Little Brother', rarity: 'common', accent: '#64748b', image: '/assets/cards/henry-id-card.webp'},
  {id: 'mike', name: 'Mike', role: 'Little Brother', rarity: 'common', accent: '#16a34a', image: '/assets/cards/mike-id-card.webp'},
  {id: 'victor', name: 'Victor Hale', role: 'Business Associate', rarity: 'rare', accent: '#64748b', image: '/assets/cards/victor-id-card.webp'},
  {id: 'azaroth', name: 'Azaroth', role: 'Main Antagonist', rarity: 'legendary', accent: '#dc2626', image: '/assets/cards/azaroth-id-card.webp'},
  {id: 'samuel', name: 'Samuel Ravenscroft', role: 'Player Father', rarity: 'legendary', accent: '#7c3aed', image: '/assets/cards/samuel-id-card.webp'},
  {id: 'mother', name: 'Ravenscroft Mother', role: 'Player Mother', rarity: 'legendary', accent: '#db2777', image: '/assets/cards/mother-id-card.webp'},
];

const RARITY_INFO: Record<string, { label: string; color: string; bg: string }> = {
  legendary: { label: 'Legendary', color: 'text-red-400', bg: 'bg-red-900/30 border-red-800/40' },
  epic: { label: 'Epic', color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-800/40' },
  rare: { label: 'Rare', color: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-800/40' },
  common: { label: 'Common', color: 'text-gray-400', bg: 'bg-gray-900/30 border-gray-700/40' },
};

const BACK_CARD_IMAGE = '/assets/cards/darknes-back-card.webp';

function CardBackFace({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-[inherit] border border-red-700/40 bg-black [backface-visibility:hidden] [transform:rotateY(180deg)] ${className}`}
      style={{ boxShadow: 'inset 0 0 30px rgba(139,0,0,0.4), 0 0 20px rgba(139,0,0,0.25)' }}
    >
      {/* Back artwork */}
      <img
        src={BACK_CARD_IMAGE}
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

type Character = (typeof ALL_CHARACTERS)[number];

// Mini-card in the gallery grid. Flips on hover to reveal the back face.
function MiniCard({
  char,
  index,
  onOpen,
}: {
  char: Character;
  index: number;
  onOpen: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
      style={{ perspective: 600 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={onOpen}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative aspect-[9/16] w-full [transform-style:preserve-3d]"
      >
        {/* Front face */}
        <div
          className="absolute inset-0 overflow-hidden rounded-lg border border-red-900/30 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] transition-all duration-200 group-hover:border-red-800/50 group-hover:shadow-[0_0_18px_rgba(139,0,0,0.18)] [backface-visibility:hidden]"
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

        {/* Back face */}
        <CardBackFace className="rounded-lg" />
      </motion.div>
    </motion.div>
  );
}

export function Gallery() {
  const navigate = useNavigate();
  const collectedCharacters = useGameStore((s) => s.collectedCharacters);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isModalFlipped, setIsModalFlipped] = useState(false);
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
      setIsModalFlipped(false);
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
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {collectedChars.map((char, index) => (
              <MiniCard
                key={char.id}
                char={char}
                index={index}
                onOpen={() => setSelectedCard(char.id)}
              />
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

      {/* Zoomed Card Modal */}
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
            {/* Outer card with 3D tilt */}
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
              style={{ perspective: 700, transformStyle: 'preserve-3d' }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsModalFlipped(true)}
              onMouseLeave={() => setIsModalFlipped(false)}
              className="relative w-[300px] cursor-pointer [transform-style:preserve-3d]"
            >
              {/* Inner flip card */}
              <motion.div
                animate={{ rotateY: isModalFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 110, damping: 18 }}
                className="relative w-full [transform-style:preserve-3d]"
              >
                {/* Card content — FRONT FACE */}
                <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-red-900/30 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] transition-all duration-200 [backface-visibility:hidden]">
                  {/* Rarity badge */}
                  <div className={`absolute right-1.5 top-1.5 z-10 rounded border px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider ${RARITY_INFO[selectedChar.rarity]?.color ?? ''} ${RARITY_INFO[selectedChar.rarity]?.bg ?? ''}`}>
                    {RARITY_INFO[selectedChar.rarity]?.label ?? selectedChar.rarity}
                  </div>

                  {/* Character Image - fit perfectly */}
                  <img
                    src={selectedChar.image}
                    alt={selectedChar.name}
                    className="absolute inset-0 h-full w-full object-cover"
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
                      {selectedChar.name[0]}
                    </span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="font-display text-xs uppercase tracking-wide text-white drop-shadow-md">
                      {selectedChar.name}
                    </h3>
                    <p className="text-[9px] uppercase tracking-wider text-red-400/70">
                      {selectedChar.role}
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
    </div>
  );
}
