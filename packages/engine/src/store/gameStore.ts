import { create } from 'zustand';
import { GamePhase } from '@darknes/shared';
import type { FlagValue, VariableValue } from '@darknes/shared';

export interface GameState {
  phase: GamePhase;
  currentSceneId: string | null;
  currentNodeId: string | null;
  playerName: string;
  endingId: string | null;
  flags: Record<string, FlagValue>;
  variables: Record<string, VariableValue>;
  collectedCharacters: string[];
  newCharacterNotification: string | null;

  setPhase: (phase: GamePhase) => void;
  setPosition: (sceneId: string, nodeId: string) => void;
  setPlayerName: (name: string) => void;
  setEndingId: (id: string | null) => void;
  setFlag: (key: string, value: FlagValue) => void;
  setVariable: (key: string, value: VariableValue) => void;
  addToVariable: (key: string, delta: number) => void;
  collectCharacter: (characterId: string) => void;
  clearNewCharacterNotification: () => void;
  resetGame: () => void;
  createNewGame: (playerName: string) => void;
  hydrate: (partial: Partial<Pick<GameState, 'flags' | 'variables' | 'currentSceneId' | 'currentNodeId' | 'playerName' | 'collectedCharacters'>>) => void;
}

const initial = {
  phase: GamePhase.Boot,
  currentSceneId: null as string | null,
  currentNodeId: null as string | null,
  playerName: '' as string,
  endingId: null as string | null,
  flags: {} as Record<string, FlagValue>,
  variables: {} as Record<string, VariableValue>,
  collectedCharacters: [] as string[],
  newCharacterNotification: null as string | null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initial,

  setPhase: (phase) => set({ phase }),

  setPosition: (sceneId, nodeId) => set({ currentSceneId: sceneId, currentNodeId: nodeId }),

  setPlayerName: (name) => set({ playerName: name }),

  setEndingId: (id) => set({ endingId: id }),

  setFlag: (key, value) =>
    set((state) => ({ flags: { ...state.flags, [key]: value } })),

  setVariable: (key, value) =>
    set((state) => ({ variables: { ...state.variables, [key]: value } })),

  addToVariable: (key, delta) =>
    set((state) => {
      const current = Number(state.variables[key] ?? 0);
      return { variables: { ...state.variables, [key]: current + delta } };
    }),

  collectCharacter: (characterId) =>
    set((state) => {
      if (state.collectedCharacters.includes(characterId)) {
        return state;
      }
      return {
        collectedCharacters: [...state.collectedCharacters, characterId],
        newCharacterNotification: characterId,
      };
    }),

  clearNewCharacterNotification: () => set({ newCharacterNotification: null }),

  resetGame: () => set({ ...initial, phase: GamePhase.MainMenu, endingId: null }),

  createNewGame: (playerName) =>
    set({
      ...initial,
      playerName,
      // Set to MainMenu phase so the flow goes through Intro:
      // MainMenu → IdentitySetup → Intro (video) → Game (startScene sets InGame)
      phase: GamePhase.MainMenu,
    }),

  hydrate: (partial) => set(partial),
}));
