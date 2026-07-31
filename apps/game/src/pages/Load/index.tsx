import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download, Trash2, Play, ChevronRight } from 'lucide-react';
import { SaveSlotKind } from '@darknes/shared';
import type { SaveFilePayload } from '@darknes/shared';
import { IconButton, SecondaryButton, PrimaryButton } from '@darknes/ui';
import { SaveEngine, StoryEngine, useSaveStore, useDialogueStore } from '@darknes/engine';
import { Notification } from '@darknes/ui';

function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const dayMs = 24 * 60 * 60 * 1000;

  if (diff < dayMs) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 7 * dayMs) {
    return `${Math.floor(diff / dayMs)} day${Math.floor(diff / dayMs) > 1 ? 's' : ''} ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}

interface SaveSlotCardProps {
  save: SaveFilePayload | null;
  slotType: 'quick' | 'auto' | 'manual';
  slotIndex?: number;
  onLoad: (payload: SaveFilePayload) => void;
  onDelete: (id: string) => void;
  onExport: (payload: SaveFilePayload) => void;
  isLoading: boolean;
}

function SaveSlotCard({ save, slotType, slotIndex, onLoad, onDelete, onExport, isLoading }: SaveSlotCardProps) {
  const labels: Record<string, string> = {
    quick: 'Quick Save',
    auto: 'Auto Save',
    manual: slotIndex !== undefined ? `Save ${slotIndex + 1}` : 'Manual',
  };

  return (
    <div className="border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Slot label */}
          <p className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-1">
            {labels[slotType]}
          </p>

          {save ? (
            <>
              {/* Save info */}
              <p className="font-body text-sm text-[var(--color-ink)] truncate">{save.meta.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-ink-faint)]">
                <span>
                  <span className="text-[var(--color-ink-muted)]">Player:</span> {save.playerName || '—'}
                </span>
                <span>
                  <span className="text-[var(--color-ink-muted)]">Scene:</span> {save.meta.sceneId}
                </span>
                <span>{formatDate(save.meta.createdAt)}</span>
              </div>
            </>
          ) : (
            <p className="font-body text-sm text-[var(--color-ink-faint)] italic">Empty</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {save ? (
            <>
              <SecondaryButton onClick={() => onLoad(save)} disabled={isLoading} className="!px-4 !py-2">
                Load
              </SecondaryButton>
              {slotType === 'manual' && (
                <IconButton
                  icon={<Download size={16} />}
                  label="Export"
                  onClick={() => onExport(save)}
                  className="!p-2"
                />
              )}
              <IconButton
                icon={<Trash2 size={16} />}
                label="Delete"
                onClick={() => onDelete(save.meta.id)}
                className="!p-2 text-[var(--color-danger)] hover:text-[var(--color-danger-strong)]"
              />
            </>
          ) : (
            <span className="text-xs text-[var(--color-ink-faint)]">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function Load() {
  const navigate = useNavigate();
  const slots = useSaveStore((s) => s.slots);
  const removeSlot = useSaveStore((s) => s.removeSlot);
  const setSlots = useSaveStore((s) => s.setSlots);
  const clearHistory = useDialogueStore((s) => s.clearHistory);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    SaveEngine.loadSaveIndex();
  }, []);

  // Get saves by type
  const quickSave = slots.find((s) => s.meta.kind === SaveSlotKind.QuickSave) ?? null;
  const autoSave = slots.find((s) => s.meta.kind === SaveSlotKind.Auto) ?? null;
  const manualSaves = slots
    .filter((s) => s.meta.kind === SaveSlotKind.Manual)
    .sort((a, b) => b.meta.createdAt - a.meta.createdAt);

  // Continue = most recent save (any type)
  const continueSave = slots.length > 0
    ? slots.sort((a, b) => b.meta.createdAt - a.meta.createdAt)[0]
    : null;

  const handleLoad = async (payload: SaveFilePayload) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsLoading(true);

    try {
      const success = SaveEngine.applySave(payload);
      if (success) {
        await StoryEngine.startScene(payload.meta.sceneId);
        navigate('/game');
      } else {
        setNotification('Failed to load save. Starting new game...');
        setTimeout(() => {
          clearHistory();
          navigate('/intro');
        }, 1500);
      }
    } catch (error) {
      console.error('[Load] Error loading save:', error);
      setNotification('Error loading save');
      setIsLoading(false);
    }
    setIsTransitioning(false);
  };

  const handleDelete = (id: string) => {
    SaveEngine.deleteSave(id);
    removeSlot(id);
    setNotification('Save deleted');
    setTimeout(() => setNotification(null), 1500);
  };

  const handleExport = (payload: SaveFilePayload) => {
    SaveEngine.exportSave(payload);
    setNotification('Save exported!');
    setTimeout(() => setNotification(null), 1500);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imported = await SaveEngine.importSave(file);
    if (imported) {
      setNotification('Save imported successfully!');
      // Refresh the slots list
      SaveEngine.loadSaveIndex();
    } else {
      setNotification('Failed to import save. Invalid file.');
    }
    setTimeout(() => setNotification(null), 2000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNewGame = () => {
    clearHistory();
    navigate('/intro');
  };

  const hasAnySaves = slots.length > 0;

  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--color-void)]">
      {/* Header */}
      <div className="flex w-full items-center gap-3 px-6 py-6">
        <IconButton icon={<ArrowLeft size={18} />} label="Back" onClick={() => navigate(-1)} />
        <h2 className="font-display text-xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
          Load Game
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Continue button - most recent save */}
          {continueSave && (
            <div>
              <button
                onClick={() => handleLoad(continueSave)}
                disabled={isLoading}
                className="w-full flex items-center justify-between border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-6 py-4 text-left transition-all hover:bg-[var(--color-accent-strong)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-accent-strong)] mb-1">
                    Continue
                  </p>
                  <p className="font-body text-base text-[var(--color-ink)]">
                    {continueSave.meta.label}
                  </p>
                  <p className="text-xs text-[var(--color-ink-faint)] mt-1">
                    {continueSave.playerName} • {continueSave.meta.sceneId} • {formatDate(continueSave.meta.createdAt)}
                  </p>
                </div>
                <Play size={24} className="text-[var(--color-accent-strong)]" />
              </button>
            </div>
          )}

          {/* Quick Save Section */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-3">
              Quick Save
            </h3>
            <SaveSlotCard
              save={quickSave}
              slotType="quick"
              onLoad={handleLoad}
              onDelete={handleDelete}
              onExport={handleExport}
              isLoading={isLoading}
            />
          </div>

          {/* Manual Saves Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">
                Manual Saves
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
              />
              <SecondaryButton
                onClick={() => fileInputRef.current?.click()}
                className="!px-3 !py-1.5 text-xs flex items-center gap-2"
              >
                <Upload size={14} />
                Import
              </SecondaryButton>
            </div>

            {/* Existing saves */}
            {manualSaves.length > 0 ? (
              <div className="space-y-2">
                {manualSaves.map((save, index) => (
                  <SaveSlotCard
                    key={save.meta.id}
                    save={save}
                    slotType="manual"
                    slotIndex={index}
                    onLoad={handleLoad}
                    onDelete={handleDelete}
                    onExport={handleExport}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[var(--color-glass-border)] px-5 py-6 text-center">
                <p className="font-body text-sm text-[var(--color-ink-faint)]">No manual saves yet</p>
                <p className="text-xs text-[var(--color-ink-faint)] mt-1">Save your game during gameplay to create a save slot</p>
              </div>
            )}
          </div>

          {/* Auto Save Section */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)] mb-3">
              Auto Save
            </h3>
            <SaveSlotCard
              save={autoSave}
              slotType="auto"
              onLoad={handleLoad}
              onDelete={handleDelete}
              onExport={handleExport}
              isLoading={isLoading}
            />
          </div>

          {/* No saves fallback */}
          {!hasAnySaves && (
            <div className="border border-dashed border-[var(--color-glass-border)] px-5 py-8 text-center">
              <p className="font-body text-[var(--color-ink-faint)]">No saved games found</p>
              <p className="text-xs text-[var(--color-ink-faint)] mt-1">
                Start a new game to begin your adventure
              </p>
            </div>
          )}

          {/* Start New Game button */}
          <div className="pt-4">
            <button
              onClick={handleNewGame}
              className="w-full flex items-center justify-center gap-2 border border-[var(--color-glass-border)] px-6 py-4 text-[var(--color-ink-muted)] hover:border-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-all"
            >
              <span className="font-display text-sm uppercase tracking-[0.15em]">Start New Game</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <Notification message={notification} />
    </div>
  );
}
