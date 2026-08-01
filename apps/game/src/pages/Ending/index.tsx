import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from '@darknes/ui';
import { useGameStore, StoryEngine } from '@darknes/engine';

const ENDING_DATA: Record<string, { title: string; description: string; bg: string }> = {
  'good-end': {
    title: 'Good Ending',
    description: '{playerName}, kau telah membuat pilihan yang tepat. Ravenscroft Group kembali, keluarga bersatu kembali, dan keadilan akhirnya datang.',
    bg: 'mansion',
  },
  'bad-ending': {
    title: 'Bad Ending',
    description: '{playerName}, kau memilih dengan hatimu. Tapi dalam dunia ini, cinta bisa menjadi senjata yang memakan pemiliknya.',
    bg: 'hospital',
  },
  'hidden-ending': {
    title: 'Hidden Ending',
    description: '{playerName}, ada jalan yang bahkan tidak kau duga. Mungkin... ini adalah akhir yang sebenarnya.',
    bg: 'basement',
  },
};

export function Ending() {
  const navigate = useNavigate();
  const { endingId, playerName } = useGameStore();

  const ending = endingId ? ENDING_DATA[endingId] : ENDING_DATA['good-end'];

  // Replace {playerName} in description
  const description = ending.description.replace('{playerName}', playerName);

  const handleReplay = () => {
    // Reset endingId
    useGameStore.getState().setEndingId(null);
    // Load scene11 and skip to the choice node (scene11_n015)
    StoryEngine.startScene('scene11', { waitForText: false }).then(() => {
      // After scene loads, we need to skip to the choice
      // The scene will auto-play, user can click to advance to choice
    });
    navigate('/game');
  };

  const handleMainMenu = () => {
    useGameStore.getState().setEndingId(null);
    useGameStore.getState().setPhase('main-menu' as any);
    navigate('/menu');
  };

  const handleExit = () => {
    // Close the browser tab/window
    window.close();
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[var(--color-void)]">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,0,0,0.15),transparent_60%)]" />

      {/* Ending Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-ink)]/90 p-8 shadow-2xl backdrop-blur-sm"
      >
        {/* Accent line */}
        <div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-[var(--color-accent-strong)] to-transparent" />

        {/* Ending Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-[var(--color-accent-strong)]"
        >
          Ending
        </motion.p>

        {/* Ending Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6 font-display text-4xl uppercase tracking-wider text-[var(--color-accent-strong)]"
        >
          {ending.title}
        </motion.h1>

        {/* Ending Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 font-body text-sm leading-relaxed text-[var(--color-ink-light)]"
        >
          {description}
        </motion.p>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col gap-3"
        >
          <PrimaryButton onClick={handleReplay} className="w-full justify-center">
            Play Again from Scene 11
          </PrimaryButton>
          <SecondaryButton onClick={handleMainMenu} className="w-full justify-center">
            Main Menu
          </SecondaryButton>
          <button
            onClick={handleExit}
            className="w-full rounded-lg border border-[var(--color-ink-light)]/30 py-3 font-display text-xs uppercase tracking-wider text-[var(--color-ink-light)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
          >
            Exit
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-[var(--color-ink-muted)]"
      >
        Darknes
      </motion.div>
    </div>
  );
}
