import { RouterProvider } from 'react-router-dom';
import { useSceneLoader } from '@darknes/engine';
import type { CharacterDefinition, SceneFile } from '@darknes/shared';
import { router } from '../router';

import xyera from '../data/characters/xyera.json';
import keyna from '../data/characters/keyna.json';
import elenna from '../data/characters/elenna.json';
import azaroth from '../data/characters/azaroth.json';

// Vite glob-imports every scene JSON file so SceneEngine can lazily resolve
// any scene id without this file knowing the full list up front.
const sceneModules = import.meta.glob<{ default: SceneFile }>('../data/scenes/scene*.json');

const scenes: Record<string, () => Promise<{ default: SceneFile }>> = {};
for (const path in sceneModules) {
  const match = path.match(/(scene\d+)\.json$/);
  if (match?.[1]) {
    scenes[match[1]] = sceneModules[path] as () => Promise<{ default: SceneFile }>;
  }
}

const characters = [xyera, keyna, elenna, azaroth] as CharacterDefinition[];

export function App() {
  useSceneLoader({ scenes, characters });

  return <RouterProvider router={router} />;
}
