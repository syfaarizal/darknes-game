import { MAX_MANUAL_SAVE_SLOTS, SaveSlotKind, STORAGE_KEYS, generateId } from '@darknes/shared';
import type { SaveFilePayload } from '@darknes/shared';
import { useGameStore } from '../../store/gameStore';
import { useDialogueStore } from '../../store/dialogueStore';
import { useSaveStore } from '../../store/saveStore';

/** Minimum required fields for a valid save */
function isSaveValid(payload: unknown): payload is SaveFilePayload {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Partial<SaveFilePayload>;
  return (
    typeof p.meta === 'object' &&
    p.meta !== null &&
    typeof p.meta.id === 'string' &&
    typeof p.meta.sceneId === 'string' &&
    typeof p.meta.nodeId === 'string' &&
    typeof p.playerName === 'string'
  );
}

function readAllSlots(): SaveFilePayload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.saves);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out invalid/corrupt saves
    return parsed.filter(isSaveValid);
  } catch {
    return [];
  }
}

function writeAllSlots(slots: SaveFilePayload[]): void {
  localStorage.setItem(STORAGE_KEYS.saves, JSON.stringify(slots));
}

export function loadSaveIndex(): SaveFilePayload[] {
  const slots = readAllSlots();
  useSaveStore.getState().setSlots(slots);
  return slots;
}

function buildSnapshot(kind: SaveSlotKind, label: string): SaveFilePayload {
  const game = useGameStore.getState();
  const dialogue = useDialogueStore.getState();

  return {
    meta: {
      id: generateId('save'),
      kind,
      createdAt: Date.now(),
      sceneId: game.currentSceneId ?? '',
      nodeId: game.currentNodeId ?? '',
      label,
    },
    playerName: game.playerName,
    flags: game.flags,
    variables: game.variables,
    history: dialogue.history,
  };
}

export function saveManual(label: string): SaveFilePayload {
  const slots = readAllSlots().filter((s) => s.meta.kind === SaveSlotKind.Manual);
  if (slots.length >= MAX_MANUAL_SAVE_SLOTS) {
    slots.shift(); // drop oldest manual save once the cap is hit
  }
  const snapshot = buildSnapshot(SaveSlotKind.Manual, label);
  const others = readAllSlots().filter((s) => s.meta.kind !== SaveSlotKind.Manual);
  const next = [...others, ...slots, snapshot];
  writeAllSlots(next);
  useSaveStore.getState().upsertSlot(snapshot);
  return snapshot;
}

export function saveAuto(): SaveFilePayload {
  const snapshot = buildSnapshot(SaveSlotKind.Auto, 'Auto Save');
  const others = readAllSlots().filter((s) => s.meta.kind !== SaveSlotKind.Auto);
  writeAllSlots([...others, snapshot]);
  useSaveStore.getState().upsertSlot(snapshot);
  return snapshot;
}

/**
 * Save to QuickSave slot (1 slot only, overwrites previous)
 */
export function saveQuick(): SaveFilePayload {
  const snapshot = buildSnapshot(SaveSlotKind.QuickSave, 'Quick Save');
  const others = readAllSlots().filter((s) => s.meta.kind !== SaveSlotKind.QuickSave);
  writeAllSlots([...others, snapshot]);
  useSaveStore.getState().upsertSlot(snapshot);
  return snapshot;
}

/**
 * Get the current QuickSave slot if it exists
 */
export function getQuickSave(): SaveFilePayload | null {
  const slots = readAllSlots();
  return slots.find((s) => s.meta.kind === SaveSlotKind.QuickSave) ?? null;
}

/**
 * Get the current AutoSave slot if it exists
 */
export function getAutoSave(): SaveFilePayload | null {
  const slots = readAllSlots();
  return slots.find((s) => s.meta.kind === SaveSlotKind.Auto) ?? null;
}

/**
 * Get all manual save slots (including empty slots up to MAX_MANUAL_SAVE_SLOTS)
 */
export function getManualSaves(): SaveFilePayload[] {
  const slots = readAllSlots().filter((s) => s.meta.kind === SaveSlotKind.Manual);
  return slots;
}

export function deleteSave(id: string): void {
  const next = readAllSlots().filter((s) => s.meta.id !== id);
  writeAllSlots(next);
  useSaveStore.getState().removeSlot(id);
}

export function applySave(payload: SaveFilePayload): boolean {
  try {
    if (!isSaveValid(payload)) {
      console.error('[SaveEngine] Invalid save payload');
      return false;
    }

    useGameStore.getState().hydrate({
      playerName: payload.playerName,
      flags: payload.flags,
      variables: payload.variables,
      currentSceneId: payload.meta.sceneId,
      currentNodeId: payload.meta.nodeId,
    });
    useDialogueStore.getState().clearHistory();
    payload.history.forEach((entry) => useDialogueStore.getState().pushHistory(entry));
    return true;
  } catch (error) {
    console.error('[SaveEngine] Failed to apply save:', error);
    return false;
  }
}

/**
 * Export a save slot to a downloadable JSON file
 */
export function exportSave(payload: SaveFilePayload): void {
  if (!isSaveValid(payload)) {
    console.error('[SaveEngine] Cannot export invalid save');
    return;
  }

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const safeLabel = payload.meta.label.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = new Date(payload.meta.createdAt).toISOString().split('T')[0];
  link.download = `darknes_save_${safeLabel}_${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import a save from a JSON file
 * Returns the imported save or null if invalid
 */
export function importSave(file: File): Promise<SaveFilePayload | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') {
          resolve(null);
          return;
        }

        const payload = JSON.parse(content);
        if (!isSaveValid(payload)) {
          console.error('[SaveEngine] Imported file is not a valid save');
          resolve(null);
          return;
        }

        // Generate new ID for imported save to avoid conflicts
        const importedPayload: SaveFilePayload = {
          ...payload,
          meta: {
            ...payload.meta,
            id: generateId('save'),
            kind: SaveSlotKind.Manual,
            createdAt: Date.now(), // Update timestamp to now
          },
        };

        // Add to manual saves
        const slots = readAllSlots().filter((s) => s.meta.kind === SaveSlotKind.Manual);
        if (slots.length >= MAX_MANUAL_SAVE_SLOTS) {
          // Remove oldest manual save
          const sorted = slots.sort((a, b) => a.meta.createdAt - b.meta.createdAt);
          const toDelete = sorted[0];
          if (toDelete) {
            deleteSave(toDelete.meta.id);
          }
        }

        const others = readAllSlots().filter((s) => s.meta.kind !== SaveSlotKind.Manual);
        writeAllSlots([...others, importedPayload]);
        useSaveStore.getState().upsertSlot(importedPayload);

        resolve(importedPayload);
      } catch (error) {
        console.error('[SaveEngine] Failed to parse import file:', error);
        resolve(null);
      }
    };

    reader.onerror = () => {
      console.error('[SaveEngine] Failed to read file');
      resolve(null);
    };

    reader.readAsText(file);
  });
}

/**
 * Check if there are any valid saves available
 */
export function hasAnySaves(): boolean {
  const slots = readAllSlots();
  return slots.length > 0;
}

/**
 * Get the most recent save (for "Continue" functionality)
 */
export function getMostRecentSave(): SaveFilePayload | null {
  const slots = readAllSlots();
  if (slots.length === 0) return null;
  return slots.sort((a, b) => b.meta.createdAt - a.meta.createdAt)[0];
}
