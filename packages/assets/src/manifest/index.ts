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
    path: 'backgrounds/office/player-office-morning.png',
    label: 'Player Office — Morning',
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
const sceneExpressions = ['scene-two-dlg1', 'nathael-shut-scene02', 'nathael-speak-scene02', 'nathael-pat-scene02'] as const;

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
  'nathael.nathael-shut-scene02': {
    characterId: 'nathael',
    expression: 'nathael-shut-scene02',
    path: 'characters/nathael/nathael-shut-scene02.webp',
  },
  'nathael.nathael-speak-scene02': {
    characterId: 'nathael',
    expression: 'nathael-speak-scene02',
    path: 'characters/nathael/nathael-speak-scene02.webp',
  },
  'nathael.nathael-pat-scene02': {
    characterId: 'nathael',
    expression: 'nathael-pat-scene02',
    path: 'characters/nathael/nathael-pat-scene02.webp',
  },
  'mike.mike-hug-scene03': {
    characterId: 'mike',
    expression: 'mike-hug-scene03',
    path: 'characters/mike/mike-hug-scene03.webp',
  },
  'mike.mike-patted-scene03': {
    characterId: 'mike',
    expression: 'mike-patted-scene03',
    path: 'characters/mike/mike-patted-scene03.webp',
  },
  'alaric.alaric-akward-speak-scene03': {
    characterId: 'alaric',
    expression: 'alaric-akward-speak-scene03',
    path: 'characters/alaric/alaric-akward-speak-scene03.webp',
  },
  'alaric.alaric-akward-shut-scene03': {
    characterId: 'alaric',
    expression: 'alaric-akward-shut-scene03',
    path: 'characters/alaric/alaric-akward-shut-scene03.webp',
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
  'damian.damian-shut-scene04': {
    characterId: 'damian',
    expression: 'damian-shut-scene04',
    path: 'characters/damian/damian-shut-scene04.webp',
  },
  'damian.damian-speak-scene04': {
    characterId: 'damian',
    expression: 'damian-speak-scene04',
    path: 'characters/damian/damian-speak-scene04.webp',
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
};
