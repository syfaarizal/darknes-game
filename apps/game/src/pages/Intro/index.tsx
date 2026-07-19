import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryEngine } from '@darknes/engine';

const INTRO_VIDEO_PATH = '/assets/videos/intro.mp4';
const FIRST_SCENE_ID = 'scene01';

type IntroState = 'loading' | 'playing' | 'placeholder' | 'transitioning';

export function Intro() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);

  const [state, setState] = useState<IntroState>('loading');
  const [videoExists, setVideoExists] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  // Check if the video file exists
  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch(INTRO_VIDEO_PATH, { method: 'HEAD' });
        const exists = response.ok;
        setVideoExists(exists);
        setState(exists ? 'loading' : 'placeholder');
      } catch {
        setVideoExists(false);
        setState('placeholder');
      }
    };
    checkVideo();
  }, []);

  // Show skip button after a short delay
  useEffect(() => {
    if (state !== 'loading') return;
    const timer = window.setTimeout(() => setShowSkip(true), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const finishIntro = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setState('transitioning');
    setIsLaunching(true);
    await StoryEngine.startScene(FIRST_SCENE_ID);
    navigate('/game');
  }, [navigate]);

  // Start video playback when ready
  useEffect(() => {
    if (state !== 'loading' || !videoRef.current) return;
    const video = videoRef.current;
    video.play().catch(() => {
      // Autoplay blocked — fall back to placeholder
      setVideoExists(false);
      setState('placeholder');
    });
  }, [state]);

  // Keyboard skip
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        void finishIntro();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finishIntro]);

  const handleSkip = () => {
    void finishIntro();
  };

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
    >
      <AnimatePresence mode="wait">
        {/* ── Video layer ─────────────────────────────────────── */}
        {state === 'loading' && videoExists && (
          <motion.video
            key="video"
            ref={videoRef}
            src={INTRO_VIDEO_PATH}
            autoPlay
            muted={false}
            playsInline
            onEnded={finishIntro}
            onError={() => {
              setVideoExists(false);
              setState('placeholder');
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeIn' }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* ── Placeholder layer ────────────────────────────────── */}
        {(state === 'placeholder' || !videoExists) && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-void)]"
          >
            {/* Atmospheric gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,0,0,0.1),transparent_65%)]" />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative z-10 mb-6 flex flex-col items-center"
            >
              <img
                src="/assets/logo/logo-darknes.png"
                alt="Darknes"
                className="mb-3 h-10 w-auto select-none object-contain"
                draggable="false"
              />
              <p className="font-display text-3xs uppercase tracking-[0.35em] text-[var(--color-accent-strong)]">
                Intro Video Placeholder
              </p>
            </motion.div>

            {/* Atmospheric text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="relative z-10 mb-16 font-body text-sm text-[var(--color-ink-muted)]"
            >
              Add your intro video to{' '}
              <code className="text-[var(--color-ink-faint)]">
                public/assets/videos/intro.mp4
              </code>
            </motion.p>

            {/* Loading indicator */}
            {state === 'loading' && isLaunching && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 font-display text-xs uppercase tracking-[0.25em] text-[var(--color-ink-faint)]"
              >
                Loading...
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ── Transition overlay ───────────────────────────────── */}
        {state === 'transitioning' && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-20 bg-black"
          />
        )}
      </AnimatePresence>

      {/* ── Skip button ─────────────────────────────────────── */}
      <AnimatePresence>
        {showSkip && state !== 'transitioning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute right-6 top-6 z-30"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="rounded-full border border-white/20 bg-black/50 px-5 py-2 font-display text-xs uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:border-[var(--color-accent-strong)] hover:text-[var(--color-accent-strong)]"
            >
              Skip
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading spinner for placeholder ─────────────────── */}
      {state === 'loading' && !videoExists && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent-strong)] border-t-transparent" />
        </div>
      )}
    </div>
  );
}
