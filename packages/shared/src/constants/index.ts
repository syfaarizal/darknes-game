import { TextSpeed } from '../enums';

export const ENGINE_VERSION = '0.1.0';

export const STORAGE_KEYS = {
  settings: 'darknes.settings.v1',
  saves: 'darknes.saves.v1',
  autosave: 'darknes.autosave.v1',
} as const;

export const MAX_MANUAL_SAVE_SLOTS = 12;

export const TEXT_SPEED_MS_PER_CHAR: Record<TextSpeed, number> = {
  [TextSpeed.Slow]: 55,
  [TextSpeed.Normal]: 28,
  [TextSpeed.Fast]: 12,
  [TextSpeed.Instant]: 0,
};

export const DEFAULT_AUTO_MODE_DELAY_MS = 1400;

export const DEFAULT_TRANSITION_DURATION_MS = 500;

export const DEFAULT_CAMERA_DURATION_MS = 800;

export const DEFAULT_AUDIO_FADE_MS = 600;

export const DEFAULT_VOLUMES = {
  master: 1,
  music: 0.8,
  sfx: 0.9,
  voice: 1,
  ambience: 0.6,
  ui: 0.7,
} as const;

/** The player character. Never rendered as a portrait — first-person POV. */
export const PLAYER_CHARACTER_ID = 'xyera';
