import { TEXT_SPEED_MS_PER_CHAR, TextSpeed } from '@darknes/shared';
import type { HistoryEntry, LineNode, VariableValue } from '@darknes/shared';
import { useDialogueStore } from '../../store/dialogueStore';
import { replaceVariables, getVariableContext } from '../VariableEngine';

/**
 * @deprecated Use replaceVariables from VariableEngine instead.
 * This re-export exists for backward compatibility.
 */
export { replaceVariables, getVariableContext } from '../VariableEngine';

/**
 * Runs the typewriter reveal for a line node. Resolves once the full text
 * is revealed (or immediately, if the store's `isSkipping`/instant speed is
 * active). Cancellable via the returned `cancel()` so a click-to-complete
 * interaction can jump straight to the full text.
 */
export function runTypewriter(
  text: string,
  speed: TextSpeed,
): { promise: Promise<void>; cancel: () => void } {
  const store = useDialogueStore.getState();
  const msPerChar = TEXT_SPEED_MS_PER_CHAR[speed];

  if (msPerChar === 0 || store.isSkipping) {
    store.setRevealedCharCount(text.length);
    return { promise: Promise.resolve(), cancel: () => {} };
  }

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  store.setTyping(true);

  const promise = new Promise<void>((resolve) => {
    let i = 0;
    const tick = () => {
      if (cancelled) {
        resolve();
        return;
      }
      i += 1;
      useDialogueStore.getState().setRevealedCharCount(i);
      if (i >= text.length) {
        useDialogueStore.getState().setTyping(false);
        resolve();
        return;
      }
      timeoutId = setTimeout(tick, msPerChar);
    };
    tick();
  });

  const cancel = () => {
    cancelled = true;
    if (timeoutId) clearTimeout(timeoutId);
    useDialogueStore.getState().setRevealedCharCount(text.length);
    useDialogueStore.getState().setTyping(false);
  };

  return { promise, cancel };
}

export function recordHistory(entry: HistoryEntry): void {
  useDialogueStore.getState().pushHistory(entry);
}

export function buildHistoryEntry(
  node: LineNode,
  sceneId: string,
  resolvedText?: string,
  playerName?: string,
  variables?: Record<string, VariableValue>,
): HistoryEntry {
  // If resolvedText is not provided, resolve variables now
  const text = resolvedText ?? (
    playerName && variables
      ? replaceVariables(node.text, getVariableContext(playerName, variables))
      : node.text
  );

  return {
    nodeId: node.id,
    sceneId,
    speaker: node.speaker,
    text,
    timestamp: Date.now(),
  };
}
