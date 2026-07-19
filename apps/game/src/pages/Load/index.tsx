import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IconButton, SecondaryButton } from '@darknes/ui';
import { SaveEngine, StoryEngine, useSaveStore } from '@darknes/engine';

export function Load() {
  const navigate = useNavigate();
  const slots = useSaveStore((s) => s.slots);

  useEffect(() => {
    SaveEngine.loadSaveIndex();
  }, []);

  const handleLoad = async (slotId: string) => {
    const payload = slots.find((s) => s.meta.id === slotId);
    if (!payload) return;
    SaveEngine.applySave(payload);
    await StoryEngine.startScene(payload.meta.sceneId);
    navigate('/game');
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-[var(--color-void)] px-6 py-10">
      <div className="mb-8 flex w-full max-w-2xl items-center gap-3">
        <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
        <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
          Load Game
        </h2>
      </div>

      <div className="w-full max-w-2xl space-y-2">
        {slots.length === 0 && (
          <p className="text-sm text-[var(--color-ink-faint)]">No saved games yet.</p>
        )}
        {slots.map((slot) => (
          <div
            key={slot.meta.id}
            className="flex items-center justify-between border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-5 py-4"
          >
            <div className="flex-1">
              {/* Slot header */}
              <p className="font-body text-sm text-[var(--color-ink)]">{slot.meta.label}</p>

              {/* Slot meta grid */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
                  <span className="font-display uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                    Player
                  </span>
                  <span className="text-[var(--color-ink)]">{slot.playerName || '—'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
                  <span className="font-display uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                    Scene
                  </span>
                  <span className="text-[var(--color-ink)]">{slot.meta.sceneId}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
                  <span className="font-display uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                    Saved
                  </span>
                  <span className="text-[var(--color-ink)]">
                    {new Date(slot.meta.createdAt).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
            <SecondaryButton onClick={() => handleLoad(slot.meta.id)} className="ml-4 shrink-0">
              Load
            </SecondaryButton>
          </div>
        ))}
      </div>
    </div>
  );
}
