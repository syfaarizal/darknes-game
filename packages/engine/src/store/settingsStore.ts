import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_AUTO_MODE_DELAY_MS,
  DEFAULT_VOLUMES,
  STORAGE_KEYS,
  TextSpeed,
} from '@darknes/shared';
import type { GameSettings } from '@darknes/shared';

export interface SettingsState extends GameSettings {
  textSpeedPreset: TextSpeed;
  setVolume: (channel: keyof GameSettings['audio'], value: number) => void;
  setTextSpeed: (preset: TextSpeed) => void;
  setAutoModeDelay: (ms: number) => void;
  setSkipUnread: (enabled: boolean) => void;
  toggleFullscreen: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audio: { ...DEFAULT_VOLUMES },
      text: {
        speed: 1,
        autoModeDelayMs: DEFAULT_AUTO_MODE_DELAY_MS,
        skipUnreadEnabled: false,
      },
      fullscreen: false,
      textSpeedPreset: TextSpeed.Normal,

      setVolume: (channel, value) =>
        set((state) => ({ audio: { ...state.audio, [channel]: value } })),

      setTextSpeed: (preset) => set({ textSpeedPreset: preset }),

      setAutoModeDelay: (ms) =>
        set((state) => ({ text: { ...state.text, autoModeDelayMs: ms } })),

      setSkipUnread: (enabled) =>
        set((state) => ({ text: { ...state.text, skipUnreadEnabled: enabled } })),

      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
    }),
    { name: STORAGE_KEYS.settings },
  ),
);
