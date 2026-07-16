import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from '@darknes/ui';
import { useSaveStore } from '@darknes/engine';

export function MainMenu() {
  const navigate = useNavigate();
  const hasSaves = useSaveStore((s) => s.slots.length > 0);

  const startNewGame = () => {
    navigate('/intro');
  };

  return (
    <div
      className="relative flex h-screen w-screen items-center overflow-hidden bg-[color:var(--color-void)] bg-cover bg-center px-16"
      style={{ backgroundImage: "url('/assets/backgrounds/library/main-menu-bg.webp')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,8,0.86)_0%,rgba(5,5,8,0.58)_42%,rgba(5,5,8,0.34)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,0,0,0.14),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 ml-[10rem] flex max-w-[32rem] flex-col items-start"
      >
        <img
          src="/assets/logo/logo-darknes.png"
          alt="Darknes"
          className="mb-2 mx-auto block h-11 w-auto select-none object-contain"
          draggable="false"
        />
        <h1 className="mb-2 font-display text-7xl uppercase tracking-[0.08em] text-[var(--color-ink)]">
          Darknes
        </h1>
        <p className="mb-8 mx-auto font-display text-3xs uppercase tracking-[0.3em] text-[var(--color-accent-strong)]">
          Interactive Novel Game
        </p>

        <Menu
          items={[
            { label: 'New Game', onClick: startNewGame, variant: 'primary' },
            {
              label: 'Continue',
              onClick: () => navigate('/load'),
              disabled: !hasSaves,
              variant: 'ghost',
            },
            { label: 'Settings', onClick: () => navigate('/settings'), variant: 'ghost' },
            { label: 'Credits', onClick: () => navigate('/credits'), variant: 'ghost' },
            { label: 'Exit Game', onClick: () => window.close(), variant: 'ghost' },
          ]}
        />
      </motion.div>
    </div>
  );
}
