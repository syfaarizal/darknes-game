import type { CharacterDefinition, CharacterStageState, ChoiceNode, LineNode } from '@darknes/shared';
import { useSceneStore } from '../../store/sceneStore';

let characterRegistry: Record<string, CharacterDefinition> = {};

/** The `game` app registers character metadata (from data/characters/*.json) at boot. */
export function registerCharacters(definitions: CharacterDefinition[]): void {
  characterRegistry = definitions.reduce<Record<string, CharacterDefinition>>((acc, def) => {
    acc[def.id] = def;
    return acc;
  }, {});
}

export function getCharacterDefinition(id: string): CharacterDefinition | undefined {
  return characterRegistry[id];
}

/**
 * Applies character stage directions from any node that carries them
 * (Line, Narration, or Choice), or falls back to marking the speaker
 * as highlighted when no explicit directions are given.
 */
export function applyNodeCharactersToStage(node: LineNode | ChoiceNode): CharacterStageState[] {
  const current = useSceneStore.getState().stageCharacters;
  const stageDirections = (node as LineNode).characters as CharacterStageState[] | CharacterStageState | undefined;

  const normalizeStageDirections = (
    value: CharacterStageState[] | CharacterStageState,
  ): CharacterStageState[] => (Array.isArray(value) ? value : [value]);

  if (stageDirections) {
    const next = normalizeStageDirections(stageDirections);
    useSceneStore.getState().setStageCharacters(next);
    return next;
  }

  const speaker = (node as LineNode).speaker;
  if (speaker && speaker.toLowerCase() !== 'player') {
    const next = current.map((c) => ({ ...c, isSpeaking: c.characterId === speaker }));
    useSceneStore.getState().setStageCharacters(next);
    return next;
  }

  return current;
}

export function resolveExpressionKey(characterId: string, expression?: string): string {
  const def = getCharacterDefinition(characterId);
  return expression ?? def?.defaultExpression ?? 'neutral';
}
