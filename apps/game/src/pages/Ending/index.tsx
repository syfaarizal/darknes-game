import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from '@darknes/ui';
import { useGameStore, VariableEngine } from '@darknes/engine';

const { replaceVariables, getVariableContext } = VariableEngine;

export function Ending() {
  const navigate = useNavigate();
  const { playerName, variables } = useGameStore();
  const ctx = getVariableContext(playerName, variables);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[var(--color-void)] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,0,0,0.12),transparent_65%)]" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-[var(--color-accent-strong)]"
      >
        Ending
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 font-display text-5xl uppercase tracking-[0.1em] text-[var(--color-accent-strong)]"
      >
        Good End
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-10 max-w-md font-body text-sm leading-relaxed text-[var(--color-ink-muted)]"
      >
        {replaceVariables(
          '{playerName}, you made the choices that kept you alive. But in this world, survival is just the beginning.',
          ctx,
        )}
      </motion.p>

      <div className="flex gap-3">
        <PrimaryButton onClick={() => navigate('/menu')}>Play Again</PrimaryButton>
        <SecondaryButton onClick={() => navigate('/menu')}>Main Menu</SecondaryButton>
      </div>
    </div>
  );
}
