import { create } from 'zustand';
import type { SaveFilePayload } from '@darknes/shared';

/** Minimum required fields for a valid save */
function isSlotValid(payload: unknown): payload is SaveFilePayload {
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

export interface SaveState {
  slots: SaveFilePayload[];
  setSlots: (slots: SaveFilePayload[]) => void;
  upsertSlot: (slot: SaveFilePayload) => void;
  removeSlot: (id: string) => void;
  validateSlot: (slot: SaveFilePayload) => boolean;
  clearCorruptSlots: () => void;
}

export const useSaveStore = create<SaveState>((set, get) => ({
  slots: [],

  setSlots: (slots) => set({ slots }),

  upsertSlot: (slot) =>
    set((state) => {
      const others = state.slots.filter((s) => s.meta.id !== slot.meta.id);
      return { slots: [...others, slot].sort((a, b) => b.meta.createdAt - a.meta.createdAt) };
    }),

  removeSlot: (id) =>
    set((state) => ({ slots: state.slots.filter((s) => s.meta.id !== id) })),

  validateSlot: (slot) => isSlotValid(slot),

  clearCorruptSlots: () =>
    set((state) => ({
      slots: state.slots.filter(isSlotValid),
    })),
}));
