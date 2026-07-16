import type { CharacterDefinition, CharacterStageState, LineNode } from '@darknes/shared';
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
 * Applies a line node's `characters` stage directions (if present), or,
 * when a line only sets a single `speaker`, marks that speaker as
 * highlighted while leaving everyone else's position untouched.
 */
export function applyLineToStage(node: LineNode): CharacterStageState[] {
  const current = useSceneStore.getState().stageCharacters;

  if (node.characters) {
    useSceneStore.getState().setStageCharacters(node.characters);
    return node.characters;
  }

  if (node.speaker) {
    const next = current.map((c) => ({ ...c, isSpeaking: c.characterId === node.speaker }));
    useSceneStore.getState().setStageCharacters(next);
    return next;
  }

  return current;
}

export function resolveExpressionKey(characterId: string, expression?: string): string {
  const def = getCharacterDefinition(characterId);
  return expression ?? def?.defaultExpression ?? 'neutral';
}
