import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Background,
  CharacterLayer,
  Camera,
  DialogueLayer,
  TopBar,
  BottomBar,
  HistoryLog,
  Notification,
  ScreenFade,
} from '@darknes/ui';
import { useDialogueRunner, useDialogueStore, useGameStore, SaveEngine } from '@darknes/engine';

const CHARACTER_COLORS: Record<string, string> = {
  xyera: '#B91C1C',
  keyna: '#8B0000',
  elenna: '#B45309',
  azaroth: '#4C1D95',
};

const FADE_DURATION_MS = 700;

export function Game() {
  const navigate = useNavigate();
  const {
    scene,
    backgroundId,
    stageCharacters,
    currentNode,
    sceneTransitionPhase,
    sceneTransitionNext,
    begin,
    skip,
  } = useDialogueRunner();
  const history = useDialogueStore((s) => s.history);
  const endingId = useGameStore((s) => s.endingId);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  /** Stays true from the moment fade-out starts until fade-in finishes. */
  const [fadeOverlayActive, setFadeOverlayActive] = useState(false);

  const prevPhaseRef = useRef(sceneTransitionPhase);

  // Navigate to ending page when endingId is set
  useEffect(() => {
    if (endingId) {
      console.log('[Game] endingId detected:', endingId, 'navigating to /ending');
      navigate('/ending');
    }
  }, [endingId, navigate]);

  useEffect(() => {
    if (prevPhaseRef.current !== sceneTransitionPhase) {
      prevPhaseRef.current = sceneTransitionPhase;
      if (sceneTransitionPhase === 'fading-out') {
        // Screen goes black
        setFadeOverlayActive(true);
      }
    }
  });

  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 1800);
  };

  const camera = currentNode && 'camera' in currentNode ? currentNode.camera : undefined;
  const transition = currentNode && 'transition' in currentNode ? currentNode.transition : undefined;

  const handleFadeInComplete = () => {
    // Screen is fully black → load next scene
    if (sceneTransitionNext) {
      begin(sceneTransitionNext);
    }
    setSceneTransition('fading-in');
    // Fade-out the overlay to reveal the new scene
    setFadeOverlayActive(false);
  };

  const handleFadeOutComplete = () => {
    setSceneTransition('idle');
  };

  // Helper to access setSceneTransition from dialogueStore
  const setSceneTransition = useDialogueStore((s) => s.setSceneTransition);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--color-void)]">
      <Camera instruction={camera}>
        <Background backgroundId={backgroundId} />
        <CharacterLayer characters={stageCharacters} />
      </Camera>

      <ScreenFade
        active={fadeOverlayActive}
        durationMs={FADE_DURATION_MS}
        onFadeInComplete={handleFadeInComplete}
        onFadeOutComplete={handleFadeOutComplete}
      />
      <ScreenFade active={transition?.type === 'flash'} />

      <TopBar
        onLog={() => setHistoryOpen(true)}
        onSave={() => navigate('/save')}
        onGallery={() => navigate('/gallery')}
        onSettings={() => navigate('/settings')}
        onMenu={() => navigate('/pause')}
      />

      <BottomBar
        onSkip={skip}
        onQuickSave={() => {
          SaveEngine.saveAuto();
          notify('Saved');
        }}
        onQuickLoad={() => navigate('/load')}
      />

      <div className="absolute inset-x-0 bottom-8 z-30">
        <DialogueLayer
          onToggleLog={() => setHistoryOpen(true)}
          speakerColorOf={(id) => CHARACTER_COLORS[id]}
        />
      </div>

      <HistoryLog open={historyOpen} entries={history} onClose={() => setHistoryOpen(false)} />
      <Notification message={notification} />

      {!scene && !currentNode && (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-ink-muted)]">
          Loading scene…
        </div>
      )}
    </div>
  );
}
