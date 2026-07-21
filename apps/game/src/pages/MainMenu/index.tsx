import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from '@darknes/ui';
import { useSaveStore, useSettingsStore, useSfxClick } from '@darknes/engine';

/* ── Staggered entrance animation constants ── */
const FADE_UP = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0  },
};
const STAGGER_BASE = 0.12;
const EASE = [0.16, 1, 0.3, 1] as const;

const menuItems = [
  { label: 'New Story',  key: 'new',      variant: 'primary' as const },
  { label: 'Load',      key: 'continue', variant: 'primary' as const, disabled: true  },
  { label: 'Settings',  key: 'settings', variant: 'primary' as const },
  { label: 'Credits',   key: 'credits',  variant: 'primary' as const },
  { label: 'Exit',      key: 'exit',     variant: 'primary' as const },
];

/* ── SVG Icons ── */
const MusicOnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const MusicOffIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export function MainMenu() {
  const navigate  = useNavigate();
  const hasSaves  = useSaveStore((s) => s.slots.length > 0);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const musicVolumeRef = useRef(1);

  const musicVolume = useSettingsStore((s) => s.audio.master * s.audio.music);
  const isMusicOn = musicVolume > 0;

  const { playClick } = useSfxClick();

  if (!audioRef.current) {
    audioRef.current = new Audio('/assets/audio/music/main-menu-bs.mp3');
  }

  /* Keep the menu backsound in sync with the settings panel. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.preload = 'auto';
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume;
    if (musicVolume <= 0) {
      audio.pause();
      return;
    }
    void audio.play().catch(() => {
      // Browser autoplay policy may block sound until the first interaction.
    });
  }, [musicVolume]);

  /* Retry playback on the first user gesture if autoplay was blocked. */
  useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current;
      if (!audio || musicVolumeRef.current <= 0) return;
      void audio.play().catch(() => {});
    };

    window.addEventListener('pointerdown', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });

    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
  }, []);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const updatedItems = menuItems.map((item) => {
    if (item.key === 'continue') return { ...item, disabled: !hasSaves };
    return item;
  });

  /* Toggle music on/off */
  const toggleMusic = () => {
    playClick();
    const settings = useSettingsStore.getState();
    const newMusicVolume = settings.audio.music > 0 ? 0 : 1;
    useSettingsStore.getState().setVolume('music', newMusicVolume);
  };

  /* Navigate to settings */
  const navigateToSettings = () => {
    playClick();
    navigate('/settings');
  };

  /* Navigate to credits */
  const navigateToCredits = () => {
    navigate('/credits');
  };

  /* Navigate to identity */
  const navigateToIdentity = () => {
    navigate('/identity');
  };

  /* Navigate to load */
  const navigateToLoad = () => {
    navigate('/load');
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[var(--color-void)]">

      {/* ── Video Background ── */}
      <video
        ref={videoRef}
        src="/assets/backgrounds/library/main-menu-bg.mp4"
        autoPlay
        loop
        playsInline
        preload="auto"
        muted
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* ── Atmospheric Overlays ── */}
      {/* Center dark vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1]
        bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.50)_0%,rgba(5,5,7,0.75)_50%,rgba(5,5,7,0.92)_100%)]" />
      {/* Subtle crimson bleed top */}
      <div className="pointer-events-none absolute inset-0 z-[1]
        bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,26,26,0.15)_0%,transparent_50%)]" />
      {/* Film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.04]
          bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22300%22 height=%22300%22 filter=%22url(%23n)%22 opacity=%221%22 fill=%22white%22/></svg>')]
          mix-blend-mode: overlay"
      />

      {/* ── Top Right Icons (Settings & Music) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
        className="absolute right-8 top-8 z-20 flex items-center gap-4"
      >
        {/* Music Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMusic}
          className="group flex items-center justify-center p-2"
          title={isMusicOn ? 'Music On' : 'Music Off'}
        >
          <motion.div
            animate={{ opacity: isMusicOn ? 1 : 0.4 }}
            className="text-[#A05252] group-hover:text-[#DC143C] transition-colors duration-300"
          >
            {isMusicOn ? <MusicOnIcon /> : <MusicOffIcon />}
          </motion.div>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 45 }}
          whileTap={{ scale: 0.95 }}
          onClick={navigateToSettings}
          className="group flex items-center justify-center p-2"
          title="Settings"
        >
          <div className="text-[#A05252] group-hover:text-[#DC143C] transition-colors duration-300">
            <SettingsIcon />
          </div>
        </motion.button>
      </motion.div>

      {/* ── Main Content (Centered) ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex w-full max-w-2xl flex-col items-center"
      >

        {/* Logo mark */}
        <motion.div
          variants={FADE_UP}
          transition={{ duration: 1.0, ease: EASE }}
          className="mb-4"
        >
          <img
            src="/assets/logo/logo-darknes.png"
            alt="Darknes Logo"
            className="h-[3rem] w-auto select-none object-contain brightness-[0.95] contrast-[1.2]"
            draggable={false}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(139, 26, 26, 0.6)) drop-shadow(0 0 40px rgba(220, 20, 60, 0.3))'
            }}
          />
        </motion.div>

        {/* Game title - Ornate serif with crimson glow */}
        <motion.h1
          variants={FADE_UP}
          transition={{ duration: 1.2, ease: EASE }}
          className="mb-3 text-7xl font-bold uppercase tracking-[0.30em]
            text-[#fffff]
            [text-shadow:0_0_30px_rgba(320,0,0,0.4),0_0_60px_rgba(220,20,60,0.4),0_0_90px_rgba(139,26,26,0.3)]"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Darknes
        </motion.h1>

        {/* Subtitle — Ornate italic serif */}
        <motion.p
          variants={FADE_UP}
          transition={{ duration: 1.0, ease: EASE }}
          className="mb-8 text-2xl italic tracking-[0.15em]
            text-[#fffff]"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          A Story of Light &amp; <span className="text-[#dc1414]">Darkness</span>
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          variants={FADE_UP}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#8B1A1A]/50" />
          <span className="text-[#8B1A1A]/40 text-sm">&#10041;</span>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#8B1A1A]/50" />
        </motion.div>

        {/* Menu */}
        <motion.div variants={FADE_UP} transition={{ duration: 0.8, ease: EASE }}>
          <Menu
            items={updatedItems.map((item) => ({
              label:    item.label,
              variant:  item.variant,
              disabled: item.disabled,
              onClick: () => {
                if (item.key === 'new')     navigateToIdentity();
                if (item.key === 'continue') navigateToLoad();
                if (item.key === 'settings') navigateToSettings();
                if (item.key === 'credits')  navigateToCredits();
                if (item.key === 'exit')     window.close();
              },
            }))}
          />
        </motion.div>

        {/* Bottom decorative ornament */}
        <motion.div
          variants={FADE_UP}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-10 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#8B1A1A]/40" />
          <span className="text-[#8B1A1A]/40 text-xs">&#10022;</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#8B1A1A]/40" />
        </motion.div>
      </motion.div>

    </div>
  );
}

/* Container variant for stagger animation */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_BASE } },
};
