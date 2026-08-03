import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '@darknes/ui';

const CHARACTERS = [
  { id: 'xyera', name: 'Xyera', role: 'Boss Lady', rarity: 'legendary', border: 'gold' },
  { id: 'elenna', name: 'Elenna', role: 'Enforcer', rarity: 'epic', border: 'diamond' },
  { id: 'keyna', name: 'Keyna', role: 'Informant', rarity: 'rare', border: 'blood' },
  { id: 'rachel', name: 'Rachel', role: 'Accountant', rarity: 'rare', border: 'particle' },
  { id: 'henry', name: 'Henry', role: 'Soldier', rarity: 'common', border: 'blood' },
  { id: 'azaroth', name: 'Azaroth', role: 'Rival Boss', rarity: 'legendary', border: 'diamond' },
];

const RARITY_STYLES: Record<string, string> = {
  legendary: 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black shadow-[0_0_15px_rgba(255,215,0,0.5)]',
  epic: 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-[0_0_15px_rgba(155,89,182,0.5)]',
  rare: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_0_15px_rgba(52,152,219,0.5)]',
  common: 'bg-gray-600/90 text-white',
};

const BORDER_STYLES: Record<string, string> = {
  gold: 'border-yellow-500/50 shadow-[0_0_20px_rgba(201,162,39,0.3)]',
  blood: 'border-red-800/50 shadow-[0_0_20px_rgba(139,0,0,0.3)]',
  diamond: 'border-purple-500/50 shadow-[0_0_20px_rgba(155,89,182,0.3)]',
  particle: 'border-blue-500/50 shadow-[0_0_20px_rgba(52,152,219,0.3)]',
};

export function Gallery() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--color-void)] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[var(--color-glass-border)] bg-[var(--color-void)]/95 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
          <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
            Character Gallery
          </h2>
          <span className="ml-auto text-sm text-[var(--color-ink-muted)]">
            {CHARACTERS.length} Characters
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:z-10"
              style={{
                borderColor: BORDER_STYLES[char.border]?.split(' ')[0].replace('border-', '') || 'var(--color-glass-border)',
                boxShadow: BORDER_STYLES[char.border]?.match(/shadow-\[.*?\]/)?.[0] || 'none',
              }}
            >
              {/* Placeholder Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-graphite)] to-[var(--color-void)]" />

              {/* Character Initial */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-display text-[var(--color-ink-muted)]/20">
                  {char.name[0]}
                </span>
              </div>

              {/* Card Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-display text-sm uppercase tracking-wide text-[var(--color-ink)]">
                  {char.name}
                </h3>
                <p className="text-xs text-[var(--color-accent)] uppercase tracking-wider">
                  {char.role}
                </p>
              </div>

              {/* Rarity Badge */}
              <span className={`absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${RARITY_STYLES[char.rarity]}`}>
                {char.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
