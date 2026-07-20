import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from '@darknes/ui';
import { useSaveStore } from '@darknes/engine';

/* ── Staggered entrance animation constants ── */
const FADE_UP = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0  },
};
const STAGGER_BASE = 0.1;
const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_BASE } },
};

const menuItems = [
  { label: 'New Game',    key: 'new',     variant: 'primary' as const },
  { label: 'Continue',   key: 'continue', variant: 'ghost'   as const, disabled: true  },
  { label: 'Settings',   key: 'settings', variant: 'ghost'   as const },
  { label: 'Credits',    key: 'credits',  variant: 'ghost'   as const },
  { label: 'Exit Game',  key: 'exit',     variant: 'ghost'   as const },
];

export function MainMenu() {
  const navigate  = useNavigate();
  const hasSaves  = useSaveStore((s) => s.slots.length > 0);
  const videoRef  = useRef<HTMLVideoElement>(null);

  /* Ensure video loops seamlessly */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.addEventListener('ended', () => { vid.currentTime = 0; vid.play(); });
  }, []);

  const updatedItems = menuItems.map((item) => {
    if (item.key === 'continue') return { ...item, disabled: !hasSaves };
    return item;
  });

  return (
    <div className="relative flex h-screen w-screen items-center overflow-hidden bg-[var(--color-void)]">

      {/* ── Video Background ── */}
      <video
        ref={videoRef}
        src="/assets/backgrounds/library/main-menu-bg.mp4"
        autoPlay
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* ── Atmospheric Overlays ── */}
      {/* Dark vignette from the left — where UI lives */}
      <div className="pointer-events-none absolute inset-0 z-[1]
        bg-[linear-gradient(to right,rgba(5,5,7,0.88)_0%,rgba(5,5,7,0.62)_42%,rgba(5,5,7,0.30)_100%)]" />
      {/* Subtle crimson bleed top-right */}
      <div className="pointer-events-none absolute inset-0 z-[1]
        bg-[radial-gradient(ellipse_at_85%_15%,rgba(122,16,16,0.18)_0%,transparent_55%)]" />
      {/* Film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.035]
          bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22300%22 height=%22300%22 filter=%22url(%23n)%22 opacity=%221%22 fill=%22white%22/></svg>')]
          mix-blend-mode: overlay"
      />

      {/* ── Decorative vertical line (left accent) ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        className="pointer-events-none absolute left-[9rem] top-0 z-[3] h-full w-px
          bg-[linear-gradient(to bottom,transparent_0%,rgba(181,25,25,0.6)_30%,rgba(181,25,25,0.6)_70%,transparent_100%)]"
      />

      {/* ── Main Content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 ml-[10rem] flex max-w-[30rem] flex-col items-start"
      >

        {/* Logo mark */}
        <motion.div variants={FADE_UP} transition={{ duration: 0.9, ease: EASE }}>
          <img
            src="/assets/logo/logo-darknes.png"
            alt="Darknes"
            className="mb-1 h-10 w-auto select-none object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Game title */}
        <motion.h1
          variants={FADE_UP}
          transition={{ duration: 1.1, ease: EASE }}
          className="mb-1 mt-2 font-display text-8xl font-bold uppercase tracking-[0.10em]
            text-[var(--color-ink)] [text-shadow:0_0_40px_rgba(181,25,25,0.25)]"
        >
          Darknes
        </motion.h1>

        {/* Subtitle — Cormorant Garamond */}
        <motion.p
          variants={FADE_UP}
          transition={{ duration: 1.0, ease: EASE }}
          className="mb-12 font-subtitle text-xl italic uppercase tracking-[0.35em]
            text-[var(--color-accent-strong)] opacity-90"
        >
          An Interactive Novel
        </motion.p>

        {/* Thin ornamental rule */}
        <motion.div
          variants={FADE_UP}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10 h-px w-16 bg-[var(--color-accent-strong)] opacity-70"
        />

        {/* Menu */}
        <motion.div variants={FADE_UP} transition={{ duration: 0.8, ease: EASE }}>
          <Menu
            items={updatedItems.map((item) => ({
              label:    item.label,
              variant:  item.variant,
              disabled: item.disabled,
              onClick: () => {
                if (item.key === 'new')     navigate('/identity');
                if (item.key === 'continue') navigate('/load');
                if (item.key === 'settings') navigate('/settings');
                if (item.key === 'credits')  navigate('/credits');
                if (item.key === 'exit')     window.close();
              },
            }))}
          />
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          variants={FADE_UP}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-16 font-body text-[10px] uppercase tracking-[0.22em]
            text-[var(--color-ink-faint)]"
        >
          &copy; 2026 Syfa Arizal Studio &nbsp;&middot;&nbsp; All Rights Reserved
        </motion.p>
      </motion.div>

    </div>
  );
}
