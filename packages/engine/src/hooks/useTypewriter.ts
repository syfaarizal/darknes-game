import { useMemo } from 'react';
import { useDialogueStore } from '../store/dialogueStore';

/**
 * Derives the currently-visible substring of a line of text from
 * `dialogueStore.revealedCharCount`. Kept as a tiny selector hook so
 * `<DialogueBox>` re-renders on every character tick without the rest of
 * `ui` needing to know the store shape.
 */
export function useTypewriter(fullText: string): { visibleText: string; isDone: boolean } {
  const revealedCharCount = useDialogueStore((s) => s.revealedCharCount);
  const isTyping = useDialogueStore((s) => s.isTyping);

  return useMemo(
    () => ({
      visibleText: fullText.slice(0, revealedCharCount),
      isDone: !isTyping && revealedCharCount >= fullText.length,
    }),
    [fullText, revealedCharCount, isTyping],
  );
}
