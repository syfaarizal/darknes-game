import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IconButton, PrimaryButton } from '@darknes/ui';
import { SaveEngine, useGameStore } from '@darknes/engine';

export function Save() {
  const navigate = useNavigate();
  const [label, setLabel] = useState('');
  const playerName = useGameStore((s) => s.playerName);

  const handleSave = () => {
    const saveLabel = label.trim() || `Save — ${new Date().toLocaleString()}`;
    SaveEngine.saveManual(saveLabel);
    navigate(-1);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-[var(--color-void)] px-6 py-10">
      <div className="mb-8 flex w-full max-w-md items-center gap-3">
        <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
        <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
          Save Game
        </h2>
      </div>

      {/* Player info preview */}
      <div className="mb-6 w-full max-w-md">
        <div className="flex items-center justify-between border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-5 py-4">
          <div>
            <p className="mb-1 font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">
              Player
            </p>
            <p className="font-body text-base text-[var(--color-ink)]">
              {playerName || 'Unknown'}
            </p>
          </div>
          <div className="h-8 w-px border-r border-[var(--color-hairline)]" />
          <div>
            <p className="mb-1 font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">
              Chapter
            </p>
            <p className="font-body text-base text-[var(--color-ink)]">—</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Save name (optional)"
          className="w-full border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent-strong)]"
        />
        <PrimaryButton onClick={handleSave} className="w-full">
          Save
        </PrimaryButton>
      </div>
    </div>
  );
}
