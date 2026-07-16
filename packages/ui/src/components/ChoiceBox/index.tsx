import { motion } from 'framer-motion';
import type { SceneChoiceOption } from '@darknes/shared';

export interface ChoiceBoxProps {
  prompt?: string;
  options: SceneChoiceOption[];
  onSelect: (option: SceneChoiceOption) => void;
}

export function ChoiceBox({ prompt, options, onSelect }: ChoiceBoxProps) {
  return (
    <div className="mx-auto w-[90%] max-w-4xl space-y-2">
      {prompt && (
        <p className="mb-2 font-body text-sm uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          {prompt}
        </p>
      )}
      {options.map((option, i) => (
        <motion.button
          key={option.id}
          onClick={() => onSelect(option)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ x: 4 }}
          className="group flex w-full items-center justify-between border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-5 py-3 text-left backdrop-blur-md transition-colors hover:border-[var(--color-accent-strong)] hover:bg-[var(--color-accent-soft)]"
        >
          <span>
            <span className="block font-body text-[15px] text-[var(--color-ink)]">
              {option.text}
            </span>
            {option.hint && (
              <span className="block text-xs text-[var(--color-ink-muted)]">{option.hint}</span>
            )}
          </span>
          <span className="text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-accent-strong)]">
            &rsaquo;
          </span>
        </motion.button>
      ))}
    </div>
  );
}
