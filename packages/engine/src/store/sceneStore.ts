import { create } from 'zustand';
import type { CharacterStageState, SceneFile } from '@darknes/shared';

export interface SceneState {
  scene: SceneFile | null;
  backgroundId: string | null;
  stageCharacters: CharacterStageState[];

  loadScene: (scene: SceneFile) => void;
  setBackground: (backgroundId: string) => void;
  setStageCharacters: (characters: CharacterStageState[]) => void;
  clearScene: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: null,
  backgroundId: null,
  stageCharacters: [],

  loadScene: (scene) => set({ scene, backgroundId: scene.meta.background }),

  setBackground: (backgroundId) => set({ backgroundId }),

  setStageCharacters: (characters) => set({ stageCharacters: characters }),

  clearScene: () => set({ scene: null, backgroundId: null, stageCharacters: [] }),
}));
