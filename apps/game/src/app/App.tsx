import { RouterProvider } from 'react-router-dom';
import { useSceneLoader } from '@darknes/engine';
import type { CharacterDefinition, SceneFile } from '@darknes/shared';
import { router } from '../router';

import nathael from '../data/characters/nathael.json';
import damian from '../data/characters/damian.json';
import alaric from '../data/characters/alaric.json';
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

const characters = [nathael, damian, alaric, azaroth] as CharacterDefinition[];

export function App() {
  useSceneLoader({ scenes, characters });

  return <RouterProvider router={router} />;
}
