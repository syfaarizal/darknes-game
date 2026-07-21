import type { AudioChannel } from '@darknes/shared';

/**
 * Single source of truth mapping short asset ids to file paths under
 * `darknes/assets/`. Components and engine modules should only ever
 * reference assets by id, never by raw path.
 *
 * Paths are relative to the project's `assets/` root and are resolved to
 * real URLs by the loaders (see `../loaders`), which use
 * `import.meta.glob` under the hood so real files just need to be dropped
 * into the matching folder — no manifest edit required for the URL to
 * resolve, only for it to have a friendly id.
 */

export interface BackgroundManifestEntry {
  id: string;
  path: string;
  label: string;
}

export const BACKGROUNDS: Record<string, BackgroundManifestEntry> = {
  office: { id: 'office', path: 'backgrounds/office/default.webp', label: 'Office' },
  'office-room-player': {
    id: 'office-room-player',
    path: 'backgrounds/office/office-room-player.webp',
    label: 'Office Room Player',
  },
  basement: { id: 'basement', path: 'backgrounds/basement/default.webp', label: 'Basement' },
  'living-room': {
    id: 'living-room',
    path: 'backgrounds/living-room/default.webp',
    label: 'Living Room',
  },
  library: { id: 'library', path: 'backgrounds/library/default.webp', label: 'Library' },
  'scene02-office': {
    id: 'scene02-office',
    path: 'backgrounds/office/bg-scene-two-nathael.png',
    label: 'Scene 02 — Office Night',
  },
};

export interface CharacterManifestEntry {
  characterId: string;
  expression: string;
  path: string;
}

const characterIds = ['nathael', 'damian', 'alaric', 'azaroth'] as const;
const defaultExpressions = ['neutral', 'smile', 'serious'] as const;
const sceneExpressions = ['scene-two-dlg1'] as const;

export const CHARACTERS: Record<string, CharacterManifestEntry> = characterIds.reduce(
  (acc, characterId) => {
    for (const expression of defaultExpressions) {
      const key = `${characterId}.${expression}`;
      acc[key] = {
        characterId,
        expression,
        path: `characters/${characterId}/${expression}.webp`,
      };
    }
    return acc;
  },
  {} as Record<string, CharacterManifestEntry>,
);

// Scene-specific expressions (not all characters have all scene expressions)
export const SCENE_CHARACTERS: Record<string, CharacterManifestEntry> = {
  'nathael.scene-two-dlg1': {
    characterId: 'nathael',
    expression: 'scene-two-dlg1',
    path: 'characters/nathael/nathael-scene-two-dlg1.png',
  },
};

export interface AudioManifestEntry {
  id: string;
  channel: AudioChannel;
  path: string;
}

/**
 * Empty by default — populate as real music/sfx/voice files are added.
 * Kept as a typed map (not an array) so `AudioEngine` lookups are O(1).
 */
export const AUDIO_TRACKS: Record<string, AudioManifestEntry> = {};
