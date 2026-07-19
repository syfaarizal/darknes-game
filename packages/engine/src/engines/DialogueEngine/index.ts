import { TEXT_SPEED_MS_PER_CHAR, TextSpeed } from '@darknes/shared';
import type { HistoryEntry, LineNode, VariableValue } from '@darknes/shared';
import { useDialogueStore } from '../../store/dialogueStore';

/**
 * Replaces all variable placeholders in text with their actual values.
 * Supported placeholders:
 *   {playerName} — the player's chosen name
 *   {variableKey} — any game variable (e.g. {money}, {trustDamian})
 *
 * Placeholders are replaced in order, so future variables can be added
 * simply by including them in the game variables map.
 */
export function replaceVariables(
  text: string,
  variables: Record<string, VariableValue>,
  playerName: string,
): string {
  let result = text;

  // Always replace playerName first
  result = result.replace(/\{playerName\}/g, playerName);

  // Replace any variable placeholders
  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(pattern, String(value));
  }

  return result;
}

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
): HistoryEntry {
  return {
    nodeId: node.id,
    sceneId,
    speaker: node.speaker,
    text: resolvedText ?? node.text,
    timestamp: Date.now(),
  };
}
