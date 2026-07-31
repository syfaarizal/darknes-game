import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import { SaveSlotKind } from '@darknes/shared';
import { IconButton, SecondaryButton, PrimaryButton } from '@darknes/ui';
import { SaveEngine, useSaveStore, useGameStore } from '@darknes/engine';
import { Notification } from '@darknes/ui';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Save() {
  const navigate = useNavigate();
  const [label, setLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const slots = useSaveStore((s) => s.slots);
  const playerName = useGameStore((s) => s.playerName);
  const currentSceneId = useGameStore((s) => s.currentSceneId);
  const currentNodeId = useGameStore((s) => s.currentNodeId);

  // Get manual saves sorted by date (newest first)
  const manualSaves = slots
    .filter((s) => s.meta.kind === SaveSlotKind.Manual)
    .sort((a, b) => b.meta.createdAt - a.meta.createdAt);

  const slotsUsed = manualSaves.length;
  const slotsTotal = 3;
  const isFull = slotsUsed >= slotsTotal;

  useEffect(() => {
    SaveEngine.loadSaveIndex();
  }, []);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);

    const saveLabel = label.trim() || `Save — ${new Date().toLocaleString()}`;
    SaveEngine.saveManual(saveLabel);

    setNotification('Game saved!');
    setTimeout(() => {
      navigate(-1);
    }, 800);
  };

  const handleDelete = (id: string) => {
    SaveEngine.deleteSave(id);
    setNotification('Save deleted');
    setTimeout(() => setNotification(null), 1500);
  };

  const handleExport = (payload: typeof manualSaves[0]) => {
    SaveEngine.exportSave(payload);
    setNotification('Save exported!');
    setTimeout(() => setNotification(null), 1500);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--color-void)]">
      {/* Header */}
      <div className="flex w-full items-center gap-3 px-6 py-6">
        <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
        <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
          Save Game
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mx-auto max-w-md space-y-6">
          {/* Current game info */}
          <div className="border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-5 py-4">
            <p className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-3">
              Current Position
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-[var(--color-ink)]">
                  {playerName || 'Unknown Player'}
                </p>
                <p className="text-xs text-[var(--color-ink-faint)] mt-1">
                  Scene: {currentSceneId || '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xs uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                  Slots Used
                </p>
                <p className="font-body text-lg text-[var(--color-ink)]">
                  {slotsUsed}/{slotsTotal}
                </p>
              </div>
            </div>
          </div>

          {/* Existing manual saves */}
          {manualSaves.length > 0 && (
            <div>
              <p className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-3">
                Existing Saves
              </p>
              <div className="space-y-2">
                {manualSaves.map((save) => (
                  <div
                    key={save.meta.id}
                    className="flex items-center justify-between border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-[var(--color-ink)] truncate">
                        {save.meta.label}
                      </p>
                      <p className="text-xs text-[var(--color-ink-faint)]">
                        {save.meta.sceneId} • {formatDate(save.meta.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <IconButton
                        icon={<Download size={14} />}
                        label="Export"
                        onClick={() => handleExport(save)}
                        className="!p-1.5"
                      />
                      <IconButton
                        icon={<Trash2 size={14} />}
                        label="Delete"
                        onClick={() => handleDelete(save.meta.id)}
                        className="!p-1.5 text-[var(--color-danger)] hover:text-[var(--color-danger-strong)]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overwrite warning if full */}
              {isFull && (
                <p className="text-xs text-[var(--color-warning)] mt-2">
                  Save slots full. Saving will overwrite your oldest save.
                </p>
              )}
            </div>
          )}

          {/* Save name input */}
          <div className="space-y-3">
            <div>
              <label className="block font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-2">
                Save Name
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={`Save at ${currentSceneId || 'current position'}`}
                className="w-full border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent-strong)]"
                maxLength={50}
              />
            </div>

            <PrimaryButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Game'}
            </PrimaryButton>
          </div>

          {/* Help text */}
          <p className="text-xs text-[var(--color-ink-faint)] text-center">
            Save your progress to continue later. You can export saves for backup.
          </p>
        </div>
      </div>

      <Notification message={notification} />
    </div>
  );
}
