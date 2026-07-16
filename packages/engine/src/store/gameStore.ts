import { create } from 'zustand';
import { GamePhase } from '@darknes/shared';
import type { FlagValue, VariableValue } from '@darknes/shared';

export interface GameState {
  phase: GamePhase;
  currentSceneId: string | null;
  currentNodeId: string | null;
  flags: Record<string, FlagValue>;
  variables: Record<string, VariableValue>;

  setPhase: (phase: GamePhase) => void;
  setPosition: (sceneId: string, nodeId: string) => void;
  setFlag: (key: string, value: FlagValue) => void;
  setVariable: (key: string, value: VariableValue) => void;
  addToVariable: (key: string, delta: number) => void;
  resetGame: () => void;
  hydrate: (partial: Partial<Pick<GameState, 'flags' | 'variables' | 'currentSceneId' | 'currentNodeId'>>) => void;
}

const initial = {
  phase: GamePhase.Boot,
  currentSceneId: null as string | null,
  currentNodeId: null as string | null,
  flags: {} as Record<string, FlagValue>,
  variables: {} as Record<string, VariableValue>,
};

export const useGameStore = create<GameState>((set) => ({
  ...initial,

  setPhase: (phase) => set({ phase }),

  setPosition: (sceneId, nodeId) => set({ currentSceneId: sceneId, currentNodeId: nodeId }),

  setFlag: (key, value) =>
    set((state) => ({ flags: { ...state.flags, [key]: value } })),

  setVariable: (key, value) =>
    set((state) => ({ variables: { ...state.variables, [key]: value } })),

  addToVariable: (key, delta) =>
    set((state) => {
      const current = Number(state.variables[key] ?? 0);
      return { variables: { ...state.variables, [key]: current + delta } };
    }),

  resetGame: () => set({ ...initial, phase: GamePhase.MainMenu }),

  hydrate: (partial) => set(partial),
}));
