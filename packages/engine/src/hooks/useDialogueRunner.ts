import { useCallback } from 'react';
import type { SceneChoiceOption } from '@darknes/shared';
import { advance, choose, startScene } from '../engines/StoryEngine';
import { useDialogueStore } from '../store/dialogueStore';
import { useSceneStore } from '../store/sceneStore';

/**
 * The primary hook `pages/Game` reaches for. Exposes the current node,
 * typewriter/choice state, and the three actions a player can take
 * (advance, pick a choice, or jump to a scene) without touching the raw
 * stores or `StoryEngine` directly.
 */
export function useDialogueRunner() {
  const currentNode = useDialogueStore((s) => s.currentNode);
  const isTyping = useDialogueStore((s) => s.isTyping);
  const revealedCharCount = useDialogueStore((s) => s.revealedCharCount);
  const pendingChoices = useDialogueStore((s) => s.pendingChoices);
  const isAutoMode = useDialogueStore((s) => s.isAutoMode);
  const toggleAutoMode = useDialogueStore((s) => s.toggleAutoMode);
  const history = useDialogueStore((s) => s.history);
  const scene = useSceneStore((s) => s.scene);
  const backgroundId = useSceneStore((s) => s.backgroundId);
  const stageCharacters = useSceneStore((s) => s.stageCharacters);

  const begin = useCallback((sceneId: string) => startScene(sceneId), []);
  const next = useCallback(() => advance(), []);
  const pick = useCallback((option: SceneChoiceOption) => choose(option), []);

  return {
    scene,
    backgroundId,
    stageCharacters,
    currentNode,
    isTyping,
    revealedCharCount,
    pendingChoices,
    isAutoMode,
    toggleAutoMode,
    history,
    begin,
    next,
    pick,
  };
}
