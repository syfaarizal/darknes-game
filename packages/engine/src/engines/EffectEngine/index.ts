/**
 * EXTENSION POINT — NOT IMPLEMENTED YET.
 *
 * Intended home for particle/weather/screen effects (fog, rain, snow,
 * screen shake, flash) once PixiJS is wired in. The shape below is a
 * stable contract other packages (scene JSON schema, `ui`'s future
 * `<EffectLayer>`) can already target, without committing to a rendering
 * implementation yet.
 *
 * When implemented, this will likely own a PixiJS `Application` mounted
 * behind the dialogue/character layers, driven by `EffectInstruction[]`
 * read from a scene node's (currently unused) `effects` field.
 */

export type EffectKind = 'fog' | 'rain' | 'snow' | 'screen-shake' | 'flash' | 'particles';

export interface EffectInstruction {
  kind: EffectKind;
  intensity?: number; // 0..1
  durationMs?: number;
}

export interface EffectEngineApi {
  play: (instruction: EffectInstruction) => void;
  stop: (kind: EffectKind) => void;
  stopAll: () => void;
}

/** No-op implementation so callers can integrate against the API today. */
export const effectEngine: EffectEngineApi = {
  play: (instruction) => {
    console.info('[EffectEngine] not yet implemented — ignored', instruction);
  },
  stop: () => {},
  stopAll: () => {},
};
