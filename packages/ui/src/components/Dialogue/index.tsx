import { motion } from 'framer-motion';
import { DialogueNodeType } from '@darknes/shared';
import {
  useDialogueRunner,
  useDialogueStore,
  useGameStore,
  VariableEngine,
} from '@darknes/engine';
import { DialogueBox } from '../DialogueBox';
import { Typewriter } from '../Typewriter';

const { replaceVariables, getVariableContext, resolveSpeakerName } = VariableEngine;

export interface DialogueLayerProps {
  onToggleLog: () => void;
  speakerColorOf?: (characterId: string) => string | undefined;
}

/**
 * The single component `pages/Game` mounts for all dialogue UI. Reads
 * `useDialogueRunner()` and switches between the line-box and choice-box
 * presentation based on the current node's type — screens never need to
 * inspect node types themselves.
 */
export function DialogueLayer({ onToggleLog, speakerColorOf }: DialogueLayerProps) {
  const { currentNode, pendingChoices, isAutoMode, toggleAutoMode, next, pick } =
    useDialogueRunner();
  const history = useDialogueStore((s) => s.history);
  const { playerName, variables } = useGameStore();
  const ctx = getVariableContext(playerName, variables);

  if (!currentNode) return null;

  if (currentNode.type === DialogueNodeType.Choice && pendingChoices) {
    return (
      <div className="relative mx-auto w-[90%] max-w-4xl">
        {/* Choices positioned at top-right, overlaying the dialogue box */}
        <div className="absolute bottom-full left-0 right-0 mb-2 flex flex-col items-end gap-2">
          {currentNode.prompt && (
            <p className="self-start font-body text-sm uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
              {replaceVariables(currentNode.prompt, ctx)}
            </p>
          )}
          <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:min-w-[280px] sm:max-w-sm">
            {pendingChoices.map((option, i) => (
              <motion.button
                key={option.id}
                onClick={() => pick(option)}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: -4 }}
                className="group flex w-full items-center justify-between border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-5 py-3 text-left backdrop-blur-md transition-colors hover:border-[var(--color-accent-strong)] hover:bg-[var(--color-accent-soft)] sm:w-auto"
              >
                <span>
                  <span className="block font-body text-[15px] text-[var(--color-ink)]">
                    {option.text}
                  </span>
                  {option.hint && (
                    <span className="block text-xs text-[var(--color-ink-muted)]">{option.hint}</span>
                  )}
                </span>
                <span className="ml-4 text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-accent-strong)]">
                  &lsaquo;
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dialogue box with previous text */}
        {history.length > 0 && (
          <div className="border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-6 py-5 backdrop-blur-md" style={{ borderRadius: 'var(--radius-panel)' }}>
            <p className="font-body text-[15px] leading-relaxed text-[var(--color-ink)] opacity-70">
              {history[history.length - 1]?.text}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (currentNode.type === DialogueNodeType.Line || currentNode.type === DialogueNodeType.Narration) {
    // Resolve the speaker name: handles {playerName} placeholder + PLAYER fallback
    const resolvedSpeaker = resolveSpeakerName(currentNode.speaker ?? '', ctx);

    // Resolve all variable placeholders in the dialogue text
    const resolvedText = replaceVariables(currentNode.text, ctx);

    const color = resolvedSpeaker ? speakerColorOf?.(resolvedSpeaker) : undefined;

    return (
      <DialogueBox
        onNext={next}
        onToggleLog={onToggleLog}
        onToggleAuto={toggleAutoMode}
        isAutoMode={isAutoMode}
        isAdvanceable
        name={resolvedSpeaker}
        nameColor={color}
      >
        <Typewriter text={resolvedText} />
      </DialogueBox>
    );
  }

  return null;
}
