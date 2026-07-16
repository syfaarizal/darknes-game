import { evaluateConditions } from '@darknes/shared';
import type { ChoiceNode, SceneChoiceOption } from '@darknes/shared';
import { useGameStore } from '../../store/gameStore';
import { useDialogueStore } from '../../store/dialogueStore';

/** Returns only the options whose conditions currently pass. */
export function getAvailableOptions(node: ChoiceNode): SceneChoiceOption[] {
  const { flags, variables } = useGameStore.getState();
  return node.options.filter((option) => evaluateConditions(option.conditions, flags, variables));
}

export function presentChoices(node: ChoiceNode): void {
  useDialogueStore.getState().setPendingChoices(getAvailableOptions(node));
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
