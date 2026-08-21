import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore, StoryEngine } from '@darknes/engine';
import { Background } from '@darknes/ui';

const ENDING_DATA: Record<string, { title: string; description: string; bg: string }> = {
  'good-end': {
    title: 'GOOD ENDING',
    description: 'Kamu memilih untuk menunda waktu. Dengan kesabaranmu, Keyna datang tepat waktu. Azaroth berhasil ditangkap, dan keluarga Rosenvelt reunited kembali.',
    bg: 'mansion',
  },
  'bad-ending': {
    title: 'BAD ENDING',
    description: 'Kamu memilih untuk menandatangani kontrak demi menyelamatkan Elenna. Tapi pilihan itu membuat Azaroth menang, dan kau kehilangan segalanya kecuali ilusi yang kau sebut teman.',
    bg: 'hospital',
  },
  'hidden-ending': {
    title: 'HIDDEN ENDING',
    description: 'Kamu merobek kontrak dan menolak untuk tunduk pada Azaroth. Meskipun peluru menemukan sasarannya, kau akhirnya reunited dengan keluarga yang sudah lama pergi. Mungkin... ini adalah akhir yang sebenarnya.',
    bg: 'basement',
  },
};

export function Ending() {
  const navigate = useNavigate();
  const { endingId, playerName } = useGameStore();

  const ending = endingId ? ENDING_DATA[endingId] : ENDING_DATA['good-end'];

  const handleReplay = () => {
    useGameStore.getState().setEndingId(null);
    StoryEngine.startScene('scene11', { waitForText: false });
    navigate('/game');
  };

  const handleMainMenu = () => {
    useGameStore.getState().setEndingId(null);
    useGameStore.getState().resetGame();
    navigate('/menu');
  };

  const handleExit = () => {
    window.close();
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      <Background backgroundId={ending.bg} />

      {/* Overlay gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        {/* Ending Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2 text-center font-display text-2xl tracking-[0.4em] text-[var(--color-accent-strong)]"
        >
          ━━━━━━
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 text-center font-display text-5xl uppercase tracking-[0.3em] text-white drop-shadow-lg"
        >
          {ending.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center font-display text-2xl tracking-[0.4em] text-[var(--color-accent-strong)]"
        >
          ━━━━━━
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12 max-w-lg text-center font-body text-base leading-relaxed text-white/90 drop-shadow-md"
        >
          {ending.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={handleReplay}
            className="min-w-[280px] rounded-lg border border-white/30 bg-white/10 px-8 py-3 font-display text-sm uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20"
          >
            Back to Scene 11
          </button>

          <button
            onClick={handleMainMenu}
            className="min-w-[280px] rounded-lg border border-white/30 bg-white/10 px-8 py-3 font-display text-sm uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20"
          >
            Main Menu
          </button>

          <button
            onClick={handleExit}
            className="min-w-[280px] rounded-lg border border-red-500/30 bg-red-500/10 px-8 py-3 font-display text-sm uppercase tracking-wider text-red-400 backdrop-blur-sm transition-all hover:border-red-500/60 hover:bg-red-500/20"
          >
            Exit
          </button>
        </motion.div>
      </div>

      {/* Game title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-xs uppercase tracking-[0.3em] text-white/30"
      >
        Darknes
      </motion.div>
    </div>
  );
}
