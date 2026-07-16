import { useEffect, useRef } from 'react';
import type { CharacterDefinition, SceneFile } from '@darknes/shared';
import { configureSceneResolver } from '../engines/SceneEngine';
import { registerCharacters } from '../engines/CharacterEngine';

export interface SceneLoaderConfig {
  scenes: Record<string, () => Promise<{ default: SceneFile }>>;
  characters: CharacterDefinition[];
}

/**
 * Called once near the router root (see `apps/game/src/app`). Wires the
 * engine's `SceneEngine`/`CharacterEngine` to this app's actual data files
 * — the one place in the whole codebase that knows the on-disk shape of
 * `src/data/`.
 */
export function useSceneLoader(config: SceneLoaderConfig): void {
  const configured = useRef(false);

  useEffect(() => {
    if (configured.current) return;
    configured.current = true;

    configureSceneResolver(async (sceneId) => {
      const importer = config.scenes[sceneId];
      if (!importer) {
        throw new Error(`[useSceneLoader] No scene registered for id "${sceneId}"`);
      }
      const mod = await importer();
      return mod.default;
    });

    registerCharacters(config.characters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
