import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryEngine } from '@darknes/engine';

const FIRST_DIALOGUE_SCENE_ID = 'scene02';
const INTRO_VIDEO_SRC = '/assets/videos/intro/scene01.webm';

export function Intro() {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const startedRef = useRef(false);

  const skipIntro = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setIsLaunching(true);
    await StoryEngine.startScene(FIRST_DIALOGUE_SCENE_ID);
    navigate('/game');
  }, [navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        void skipIntro();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [skipIntro]);

  useEffect(() => {
    if (!videoFailed) return;
    const timer = window.setTimeout(() => {
      void skipIntro();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [skipIntro, videoFailed]);

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white"
      onClick={() => void skipIntro()}
      role="button"
      tabIndex={0}
      aria-label="Skip intro and start the story"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={INTRO_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        onEnded={() => void skipIntro()}
        onError={() => setVideoFailed(true)}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.55)_100%)]" />

      <div className="absolute right-6 top-6 z-10">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            void skipIntro();
          }}
          className="rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:border-[var(--color-accent-strong)] hover:text-[var(--color-accent-strong)]"
        >
          Skip
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-white/70">
          Intro
        </p>
        <h1 className="font-display text-4xl uppercase tracking-[0.12em] text-white">
          Darknes
        </h1>
        <p className="max-w-md text-sm text-white/70">
          {videoFailed
            ? 'Intro video belum tersedia. Game akan langsung masuk ke cerita.'
            : 'Tekan Skip, Enter, Esc, atau klik layar untuk melewati intro.'}
        </p>
        {isLaunching && <p className="text-xs uppercase tracking-[0.25em] text-white/45">Loading...</p>}
      </div>
    </div>
  );
}
