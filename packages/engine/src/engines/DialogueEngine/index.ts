import { TEXT_SPEED_MS_PER_CHAR, TextSpeed } from '@darknes/shared';
import type { HistoryEntry, LineNode, VariableValue } from '@darknes/shared';
import { useDialogueStore } from '../../store/dialogueStore';
import { replaceVariables, getVariableContext, resolveSpeakerName } from '../VariableEngine';

export { replaceVariables, getVariableContext, resolveSpeakerName } from '../VariableEngine';

let typewriterGeneration = 0;

export function runTypewriter(
  text: string,
  speed: TextSpeed,
): { promise: Promise<void>; cancel: () => void } {
  const store = useDialogueStore.getState();
  const msPerChar = TEXT_SPEED_MS_PER_CHAR[speed];
  const generation = ++typewriterGeneration;

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
      if (generation !== typewriterGeneration) {
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
    typewriterGeneration += 1;
    if (timeoutId) clearTimeout(timeoutId);
    useDialogueStore.getState().setRevealedCharCount(text.length);
    useDialogueStore.getState().setTyping(false);
  };

  return { promise, cancel };
}

/** Finish the active typewriter before advancing to the next node. */
export function finishTypewriter(text: string): void {
  typewriterGeneration += 1;
  useDialogueStore.getState().setRevealedCharCount(text.length);
  useDialogueStore.getState().setTyping(false);
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
  const ctx = playerName && variables ? getVariableContext(playerName, variables) : null;

  // Resolve text
  const text = resolvedText ?? (
    ctx
      ? replaceVariables(node.text, ctx)
      : node.text
  );

  // Resolve speaker name (converts "player"/"PLAYER"/"{playerName}" → actual playerName)
  const speaker = ctx
    ? resolveSpeakerName(node.speaker, ctx)
    : (node.speaker ?? '');

  return {
    nodeId: node.id,
    sceneId,
    speaker,
    text,
    timestamp: Date.now(),
  };
}
