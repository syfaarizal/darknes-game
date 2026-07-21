import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryEngine } from '@darknes/engine';

const INTRO_VIDEO_PATH = '/assets/videos/intro.mp4';
const FIRST_SCENE_ID = 'scene02';

export function Intro() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);

  const [isLaunching, setIsLaunching] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSkip(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  const finishIntro = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setIsLaunching(true);
    // Load the scene and mount its first node, but do not wait for the
    // narration typewriter. The story screen should be visible immediately.
    await StoryEngine.startScene(FIRST_SCENE_ID, { waitForText: false });
    navigate('/game');
  }, [navigate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // The video should be available after the headset reminder flow.
      // If autoplay still fails, the user can skip and continue.
    });
  }, []);

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
        <motion.video
          key="video"
          ref={videoRef}
          src={INTRO_VIDEO_PATH}
          autoPlay
          muted={false}
          playsInline
          onEnded={finishIntro}
          onError={finishIntro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeIn' }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {isLaunching && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-20 bg-black"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkip && !isLaunching && (
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
    </div>
  );
}
