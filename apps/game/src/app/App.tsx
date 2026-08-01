import { useEffect, useRef } from 'react';
import { useNavigate, RouterProvider } from 'react-router-dom';
import { useSceneLoader, useGameStore } from '@darknes/engine';
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
  const match = path.match(/(scene[\w]+)\.json$/);
  if (match?.[1]) {
    scenes[match[1]] = sceneModules[path] as () => Promise<{ default: SceneFile }>;
  }
}

const characters = [xyera, keyna, elenna, azaroth] as CharacterDefinition[];

/**
 * Handles navigation based on game phase changes.
 * Must be rendered inside RouterProvider context.
 */
function PhaseNavigation() {
  const navigate = useNavigate();
  const phase = useGameStore((s) => s.phase);
  const lastPhaseRef = useRef(phase);

  useEffect(() => {
    // Avoid navigating to the same route
    if (lastPhaseRef.current === phase) return;
    lastPhaseRef.current = phase;

    switch (phase) {
      case 'main-menu':
        navigate('/menu');
        break;
      case 'ending':
        navigate('/ending');
        break;
      case 'credits':
        navigate('/credits');
        break;
      case 'in-game':
        navigate('/game');
        break;
      default:
        break;
    }
  }, [phase, navigate]);

  return null;
}

/**
 * App root with scene loader and phase-based navigation.
 */
export function App() {
  useSceneLoader({ scenes, characters });

  // PhaseNavigation is rendered as a child of RouterProvider so it has access to router context
  return (
    <RouterProvider router={router}>
      <PhaseNavigation />
    </RouterProvider>
  );
}
