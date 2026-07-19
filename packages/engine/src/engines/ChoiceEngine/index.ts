import { evaluateConditions } from '@darknes/shared';
import type { ChoiceNode, SceneChoiceOption } from '@darknes/shared';
import { useGameStore } from '../../store/gameStore';
import { useDialogueStore } from '../../store/dialogueStore';
import { replaceVariables, getVariableContext } from '../VariableEngine';

interface ResolvedChoiceOption {
  id: string;
  text: string;
  hint?: string;
  goTo: string;
  conditions?: ChoiceNode['options'][0]['conditions'];
  setFlags?: ChoiceNode['options'][0]['setFlags'];
  setVariables?: ChoiceNode['options'][0]['setVariables'];
}

/** Returns only the options whose conditions currently pass. */
export function getAvailableOptions(node: ChoiceNode): SceneChoiceOption[] {
  const { flags, variables } = useGameStore.getState();
  return node.options.filter((option) => evaluateConditions(option.conditions, flags, variables));
}

/**
 * Presents choices to the player, with all variable placeholders resolved.
 * e.g. "You have {money} coins" → "You have 150 coins"
 */
export function presentChoices(node: ChoiceNode): void {
  const { playerName, variables } = useGameStore.getState();
  const ctx = getVariableContext(playerName, variables);

  const available = getAvailableOptions(node);

  const resolved: ResolvedChoiceOption[] = available.map((option) => ({
    id: option.id,
    text: replaceVariables(option.text, ctx),
    hint: option.hint ? replaceVariables(option.hint, ctx) : undefined,
    goTo: option.goTo,
    conditions: option.conditions,
    setFlags: option.setFlags,
    setVariables: option.setVariables,
  }));

  useDialogueStore.getState().setPendingChoices(resolved as SceneChoiceOption[]);
}

/**
 * Applies an option's flag/variable mutations and returns the node id to
 * jump to next. Callers (StoryEngine) are responsible for the actual jump.
 */
export function resolveChoice(option: SceneChoiceOption): string {
  const game = useGameStore.getState();

  option.setFlags?.forEach((mutation) => game.setFlag(mutation.key, mutation.value));

  option.setVariables?.forEach((mutation) => {
    if (!mutation.op || mutation.op === 'set') {
      game.setVariable(mutation.key, mutation.value);
    } else {
      const delta = Number(mutation.value) * (mutation.op === 'subtract' ? -1 : 1);
      game.addToVariable(mutation.key, delta);
    }
  });

  useDialogueStore.getState().setPendingChoices(null);
  return option.goTo;
}
