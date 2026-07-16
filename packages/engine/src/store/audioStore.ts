import { create } from 'zustand';
import type { AudioChannel } from '@darknes/shared';

export interface ActiveTrack {
  id: string;
  channel: AudioChannel;
  howlId: number;
}

export interface AudioState {
  activeTracks: Record<string, ActiveTrack>;
  registerTrack: (key: string, track: ActiveTrack) => void;
  unregisterTrack: (key: string) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  activeTracks: {},

  registerTrack: (key, track) =>
    set((state) => ({ activeTracks: { ...state.activeTracks, [key]: track } })),

  unregisterTrack: (key) =>
    set((state) => {
      const next = { ...state.activeTracks };
      delete next[key];
      return { activeTracks: next };
    }),
}));
