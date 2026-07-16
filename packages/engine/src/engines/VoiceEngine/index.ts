/**
 * EXTENSION POINT — NOT IMPLEMENTED YET.
 *
 * `AudioEngine` already plays a line's `voice` cue as a plain
 * `AudioChannel.Voice` clip. This module is the future home for
 * voice-specific behavior layered on top of that: lip-sync driven by
 * amplitude analysis, idle blink animation timing, and per-character
 * voice volume overrides.
 */

export interface VoiceLine {
  characterId: string;
  audioId: string;
}

export interface LipSyncFrame {
  timeMs: number;
  mouthOpenness: number; // 0..1
}

export interface VoiceEngineApi {
  playLine: (line: VoiceLine) => Promise<void>;
  getLipSyncFrames: (line: VoiceLine) => Promise<LipSyncFrame[]>;
  isBlinkEnabled: (characterId: string) => boolean;
}

/** No-op / stub implementation — wire real playback + analysis later. */
export const voiceEngine: VoiceEngineApi = {
  playLine: async (line) => {
    console.info('[VoiceEngine] not yet implemented — ignored', line);
  },
  getLipSyncFrames: async () => [],
  isBlinkEnabled: () => false,
};
