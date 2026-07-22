import { create } from 'zustand';
import type { HistoryEntry, SceneChoiceOption, SceneNode } from '@darknes/shared';

export type SceneTransitionPhase = 'idle' | 'fading-out' | 'fading-in';

export interface DialogueState {
  currentNode: SceneNode | null;
  isTyping: boolean;
  revealedCharCount: number;
  pendingChoices: SceneChoiceOption[] | null;
  history: HistoryEntry[];
  isAutoMode: boolean;
  isSkipping: boolean;
  /** Set by StoryEngine when an End node with nextScene is reached. */
  sceneTransitionPhase: SceneTransitionPhase;
  /** The next scene to load after the fade-to-black. */
  sceneTransitionNext: string | null;

  setCurrentNode: (node: SceneNode | null) => void;
  setTyping: (isTyping: boolean) => void;
  setRevealedCharCount: (count: number) => void;
  setPendingChoices: (choices: SceneChoiceOption[] | null) => void;
  pushHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  toggleAutoMode: () => void;
  setSkipping: (isSkipping: boolean) => void;
  setSceneTransition: (phase: SceneTransitionPhase, nextScene?: string | null) => void;
}

export const useDialogueStore = create<DialogueState>((set) => ({
  currentNode: null,
  isTyping: false,
  revealedCharCount: 0,
  pendingChoices: null,
  history: [],
  isAutoMode: false,
  isSkipping: false,
  sceneTransitionPhase: 'idle',
  sceneTransitionNext: null,

  setCurrentNode: (node) => set({ currentNode: node, revealedCharCount: 0 }),
  setTyping: (isTyping) => set({ isTyping }),
  setRevealedCharCount: (count) => set({ revealedCharCount: count }),
  setPendingChoices: (choices) => set({ pendingChoices: choices }),

  pushHistory: (entry) =>
    set((state) => ({ history: [...state.history, entry] })),

  clearHistory: () => set({ history: [] }),

  toggleAutoMode: () => set((state) => ({ isAutoMode: !state.isAutoMode })),

  setSkipping: (isSkipping) => set({ isSkipping }),

  setSceneTransition: (phase, nextScene = null) =>
    set({ sceneTransitionPhase: phase, sceneTransitionNext: nextScene }),
}));
