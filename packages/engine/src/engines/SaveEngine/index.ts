import { MAX_MANUAL_SAVE_SLOTS, SaveSlotKind, STORAGE_KEYS, generateId } from '@darknes/shared';
import type { SaveFilePayload } from '@darknes/shared';
import { useGameStore } from '../../store/gameStore';
import { useDialogueStore } from '../../store/dialogueStore';
import { useSaveStore } from '../../store/saveStore';

function readAllSlots(): SaveFilePayload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.saves);
    return raw ? (JSON.parse(raw) as SaveFilePayload[]) : [];
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

export function deleteSave(id: string): void {
  const next = readAllSlots().filter((s) => s.meta.id !== id);
  writeAllSlots(next);
  useSaveStore.getState().removeSlot(id);
}

export function applySave(payload: SaveFilePayload): void {
  useGameStore.getState().hydrate({
    flags: payload.flags,
    variables: payload.variables,
    currentSceneId: payload.meta.sceneId,
    currentNodeId: payload.meta.nodeId,
  });
  useDialogueStore.getState().clearHistory();
  payload.history.forEach((entry) => useDialogueStore.getState().pushHistory(entry));
}
