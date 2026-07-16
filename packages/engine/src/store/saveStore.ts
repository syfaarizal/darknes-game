import { create } from 'zustand';
import type { SaveFilePayload } from '@darknes/shared';

export interface SaveState {
  slots: SaveFilePayload[];
  setSlots: (slots: SaveFilePayload[]) => void;
  upsertSlot: (slot: SaveFilePayload) => void;
  removeSlot: (id: string) => void;
}

export const useSaveStore = create<SaveState>((set) => ({
  slots: [],

  setSlots: (slots) => set({ slots }),

  upsertSlot: (slot) =>
    set((state) => {
      const others = state.slots.filter((s) => s.meta.id !== slot.meta.id);
      return { slots: [...others, slot].sort((a, b) => b.meta.createdAt - a.meta.createdAt) };
    }),

  removeSlot: (id) =>
    set((state) => ({ slots: state.slots.filter((s) => s.meta.id !== id) })),
}));
