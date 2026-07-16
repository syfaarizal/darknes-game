import type { SceneFile } from '@darknes/shared';
import { useSceneStore } from '../../store/sceneStore';

export type SceneResolver = (sceneId: string) => Promise<SceneFile>;

let resolver: SceneResolver | null = null;
const cache = new Map<string, SceneFile>();

/**
 * The `game` app calls this once at boot, wiring the engine to its own
 * `data/scenes/*.json` files (e.g. via `import.meta.glob`). Keeping the
 * loading strategy out of this package is what lets a second game reuse
 * the same engine with completely different scene files.
 */
export function configureSceneResolver(fn: SceneResolver): void {
  resolver = fn;
}

export async function loadScene(sceneId: string): Promise<SceneFile> {
  if (!resolver) {
    throw new Error(
      '[SceneEngine] No scene resolver configured. Call configureSceneResolver() at app boot.',
    );
  }

  const cached = cache.get(sceneId);
  if (cached) {
    useSceneStore.getState().loadScene(cached);
    return cached;
  }

  const scene = await resolver(sceneId);
  cache.set(sceneId, scene);
  useSceneStore.getState().loadScene(scene);
  return scene;
}

export function getNodeById(scene: SceneFile, nodeId: string) {
  return scene.nodes.find((n) => n.id === nodeId) ?? null;
}

export function clearSceneCache(): void {
  cache.clear();
}
