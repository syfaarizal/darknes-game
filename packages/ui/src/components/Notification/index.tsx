import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore, VariableEngine } from '@darknes/engine';

const { replaceVariables, getVariableContext } = VariableEngine;

export interface NotificationProps {
  message: string | null;
}

export function Notification({ message }: NotificationProps) {
  const { playerName, variables } = useGameStore();
  const ctx = getVariableContext(playerName, variables);

  const resolved = message ? replaceVariables(message, ctx) : null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2">
      <AnimatePresence>
        {resolved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-4 py-2 text-xs uppercase tracking-[0.1em] text-[var(--color-ink)] backdrop-blur-md"
          >
            {resolved}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
