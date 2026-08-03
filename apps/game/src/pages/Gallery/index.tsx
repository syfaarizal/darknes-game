import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@darknes/ui';
import { useGameStore } from '@darknes/engine';

const ALL_CHARACTERS = [
  { id: 'xyera', name: 'Xyera', role: 'Boss Lady', rarity: 'legendary', border: 'red' },
  { id: 'elenna', name: 'Elenna', role: 'Enforcer', rarity: 'epic', border: 'gold' },
  { id: 'keyna', name: 'Keyna', role: 'Informant', rarity: 'rare', border: 'purple' },
  { id: 'rachel', name: 'Rachel', role: 'Accountant', rarity: 'rare', border: 'blue' },
  { id: 'henry', name: 'Henry', role: 'Soldier', rarity: 'common', border: 'gray' },
  { id: 'azaroth', name: 'Azaroth', role: 'Rival Boss', rarity: 'legendary', border: 'red' },
];

const RARITY_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
  legendary: { bg: 'from-red-600 to-red-800', text: 'text-white', glow: 'shadow-[0_0_12px_rgba(220,38,38,0.5)]' },
  epic: { bg: 'from-purple-600 to-purple-800', text: 'text-white', glow: 'shadow-[0_0_12px_rgba(147,51,234,0.5)]' },
  rare: { bg: 'from-blue-600 to-blue-800', text: 'text-white', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]' },
  common: { bg: 'from-gray-600 to-gray-800', text: 'text-gray-200', glow: '' },
};

const BORDER_COLORS: Record<string, string> = {
  red: 'border-red-900/60',
  gold: 'border-yellow-600/60',
  purple: 'border-purple-700/60',
  blue: 'border-blue-700/60',
  gray: 'border-gray-600/60',
};

export function Gallery() {
  const navigate = useNavigate();
  const collectedCharacters = useGameStore((s) => s.collectedCharacters);

  // Filter to only show collected characters, sorted by order in ALL_CHARACTERS
  const collectedChars = ALL_CHARACTERS.filter((c) =>
    collectedCharacters.includes(c.id)
  );

  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--color-void)] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-red-900/30 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)] px-4 py-3">
        <div className="flex items-center gap-3">
          <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
          <h2 className="font-display text-lg uppercase tracking-[0.15em] text-[var(--color-ink)]">
            Collection
          </h2>
          <span className="ml-auto text-xs text-red-500/80">
            {collectedChars.length}/{ALL_CHARACTERS.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Empty State */}
        {collectedChars.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-4 text-5xl text-red-900/30">
              <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/>
              </svg>
            </div>
            <p className="text-sm uppercase tracking-wider text-[var(--color-ink-muted)]">
              No Characters Collected
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
              Meet characters in the story to add them here
            </p>
          </div>
        ) : (
          /* Grid of small cards */
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {collectedChars.map((char) => {
              const rarityStyle = RARITY_STYLES[char.rarity];
              return (
                <div
                  key={char.id}
                  className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:z-10"
                  style={{
                    borderColor: BORDER_COLORS[char.border],
                    boxShadow: `0 0 15px ${char.border === 'red' ? 'rgba(139,0,0,0.3)' : char.border === 'gold' ? 'rgba(201,162,39,0.2)' : 'transparent'}`,
                  }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${rarityStyle.bg} opacity-20`} />

                  {/* Placeholder character initial */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)]">
                    <span className="text-4xl font-display text-white/15">
                      {char.name[0]}
                    </span>
                  </div>

                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Rarity Badge - smaller */}
                  <span
                    className={`absolute right-1 top-1 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${rarityStyle.text} ${rarityStyle.glow} bg-black/50`}
                  >
                    {char.rarity}
                  </span>

                  {/* Character Initial overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-display text-white/10">
                      {char.name[0]}
                    </span>
                  </div>

                  {/* Info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="font-display text-xs uppercase tracking-wide text-white drop-shadow-md">
                      {char.name}
                    </h3>
                    <p className="text-[9px] uppercase tracking-wider text-red-400/80">
                      {char.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="shrink-0 border-t border-red-900/20 px-4 py-2 text-center">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
          {collectedChars.length === 0
            ? 'Explore the story to discover characters'
            : `${collectedChars.length} of ${ALL_CHARACTERS.length} characters discovered`}
        </span>
      </div>
    </div>
  );
}
