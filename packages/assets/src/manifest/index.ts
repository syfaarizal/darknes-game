import { AudioChannel } from '@darknes/shared';

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
  'living-room-scene03': {
    id: 'living-room-scene03',
    path: 'backgrounds/living-room/bg-living-room-scene03.webp',
    label: 'Living Room — Scene 03',
  },
  'player-office-morning': {
    id: 'player-office-morning',
    path: 'backgrounds/office/player-office-morning.webp',
    label: 'Player Office — Morning',
  },
  'player-office-night': {
    id: 'player-office-night',
    path: 'backgrounds/office/player-office-night.webp',
    label: 'Ravenscroft House — Workspace — Night',
  },
  library: { id: 'library', path: 'backgrounds/library/default.webp', label: 'Library' },
  'player-office-night-scene02': {
    id: 'player-office-night-scene02',
    path: 'backgrounds/office/player-office-night-scene02.webp',
    label: 'Scene 02 — Office Night',
  },
};

export interface CharacterManifestEntry {
  characterId: string;
  expression: string;
  path: string;
}

const characterIds = ['xyera', 'keyna', 'elenna', 'azaroth'] as const;
const defaultExpressions = ['neutral', 'smile', 'serious'] as const;
const sceneExpressions = ['scene-two-dlg1', 'xyera-shut-scene02', 'xyera-speak-scene02', 'xyera-pat-scene02'] as const;

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
  'xyera.scene-two-dlg1': {
    characterId: 'xyera',
    expression: 'scene-two-dlg1',
    path: 'characters/xyera/xyera-scene-two-dlg1.png',
  },
  'xyera.xyera-shut-scene02': {
    characterId: 'xyera',
    expression: 'xyera-shut-scene02',
    path: 'characters/xyera/xyera-shut-scene02.webp',
  },
  'xyera.xyera-speak-scene02': {
    characterId: 'xyera',
    expression: 'xyera-speak-scene02',
    path: 'characters/xyera/xyera-speak-scene02.webp',
  },
  'xyera.xyera-pat-scene02': {
    characterId: 'xyera',
    expression: 'xyera-pat-scene02',
    path: 'characters/xyera/xyera-pat-scene02.webp',
  },
  'rachel.rachel-hug-scene03': {
    characterId: 'rachel',
    expression: 'rachel-hug-scene03',
    path: 'characters/rachel/rachel-hug-scene03.webp',
  },
  'rachel.rachel-patted-scene03': {
    characterId: 'rachel',
    expression: 'rachel-patted-scene03',
    path: 'characters/rachel/rachel-patted-scene03.webp',
  },
  'elenna.elenna-akward-speak-scene03': {
    characterId: 'elenna',
    expression: 'elenna-akward-speak-scene03',
    path: 'characters/elenna/elenna-akward-speak-scene03.webp',
  },
  'elenna.elenna-akward-shut-scene03': {
    characterId: 'elenna',
    expression: 'elenna-akward-shut-scene03',
    path: 'characters/elenna/elenna-akward-shut-scene03.webp',
  },
  'henry.henry-yawn-scene03': {
    characterId: 'henry',
    expression: 'henry-yawn-scene03',
    path: 'characters/henry/henry-yawn-scene03.webp',
  },
  'henry.henry-shut-scene03': {
    characterId: 'henry',
    expression: 'henry-shut-scene03',
    path: 'characters/henry/henry-shut-scene03.webp',
  },
  // scene04 — keyna
  'keyna.keyna-shut-scene04': {
    characterId: 'keyna',
    expression: 'keyna-shut-scene04',
    path: 'characters/keyna/keyna-shut-scene04.webp',
  },
  'keyna.keyna-speak-scene04': {
    characterId: 'keyna',
    expression: 'keyna-speak-scene04',
    path: 'characters/keyna/keyna-speak-scene04.webp',
  },
  'keyna.keyna-turn-around-scene04': {
    characterId: 'keyna',
    expression: 'keyna-turn-around-scene04',
    path: 'characters/keyna/keyna-turn-around-scene04.webp',
  },
  // scene05 — xyera default
  'xyera.xyera-speak-scene05': {
    characterId: 'xyera',
    expression: 'speak',
    path: 'characters/xyera/xyera-speak-scene05.webp',
  },
  'xyera.xyera-shut-scene05': {
    characterId: 'xyera',
    expression: 'neutral',
    path: 'characters/xyera/xyera-shut-scene05.webp',
  },
  // scene05 — xyera map variant
  'xyera.xyera-speak-map-scene05': {
    characterId: 'xyera',
    expression: 'speak-map',
    path: 'characters/xyera/xyera-speak-map-scene05.webp',
  },
  'xyera.xyera-shut-map-scene-05': {
    characterId: 'xyera',
    expression: 'shut-map',
    path: 'characters/xyera/xyera-shut-map-scene-05.webp',
  },
  // scene05 — xyera crossarm variant
  'xyera.xyera-smile-crossarm-scene05': {
    characterId: 'xyera',
    expression: 'smile-crossarm',
    path: 'characters/xyera/xyera-smile-crossarm-scene05.webp',
  },
  'xyera.xyera-shut-crossarm-scene05': {
    characterId: 'xyera',
    expression: 'shut-crossarm',
    path: 'characters/xyera/xyera-shut-crossarm-scene05.webp',
  },
  'xyera.xyera-speak-crossarm-scene05': {
    characterId: 'xyera',
    expression: 'speak-crossarm',
    path: 'characters/xyera/xyera-speak-crossarm-scene05.webp',
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
export const AUDIO_TRACKS: Record<string, AudioManifestEntry> = {
  footsteps: {
    id: 'footsteps',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/footsteps-fsx.mp3',
  },
  stroking_hair: {
    id: 'stroking_hair',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/stroking-hair-sfx.mp3',
  },
  rustling: {
    id: 'rustling',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/rustling-sfx.mp3',
  },
  opendoor_footstep_dropbook: {
    id: 'opendoor_footstep_dropbook',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/opendoor-footstep-dropbook.mp3',
  },
  take_flip_papper: {
    id: 'take_flip_papper',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/take-flip-papper.mp3',
  },
  page_flip: {
    id: 'page_flip',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/page-flip-sfx.mp3',
  },
  take_papper: {
    id: 'take_papper',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/take-papper-sfx.mp3',
  },
  drop_book: {
    id: 'drop_book',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/drop-book-sfx.mp3',
  },
  writing_on_paper: {
    id: 'writing_on_paper',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/writing-on-paper-fsx.mp3',
  },
  take_paper_footsteps: {
    id: 'take_paper_footsteps',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/take-paper-footsteps.mp3',
  },
  open_close_door: {
    id: 'open_close_door',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/open-close-door-sfx.mp3',
  },
  'small-footsteps-hug': {
    id: 'small-footsteps-hug',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/small-footsteps-hug.mp3',
  },
  open_door: {
    id: 'open_door',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/open-door-sfx.mp3',
  },
  footsteps_sitting: {
    id: 'footsteps_sitting',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/footsteps-sitting-sfx.mp3',
  },
  grab_pen_tight: {
    id: 'grab_pen_tight',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/grab-pen-tight-sfx.mp3',
  },
  up_stroking: {
    id: 'up_stroking',
    channel: AudioChannel.Sfx,
    path: 'audio/sfx/up-stroking-sfx.mp3',
  },
};
