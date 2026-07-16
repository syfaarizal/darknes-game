import { useState } from 'react';
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
import { useDialogueRunner, useDialogueStore, SaveEngine } from '@darknes/engine';

const CHARACTER_COLORS: Record<string, string> = {
  nathael: '#B91C1C',
  damian: '#8B0000',
  alaric: '#B45309',
  azaroth: '#4C1D95',
};

export function Game() {
  const navigate = useNavigate();
  const { scene, backgroundId, stageCharacters, currentNode } = useDialogueRunner();
  const isSkipping = useDialogueStore((s) => s.isSkipping);
  const setSkipping = useDialogueStore((s) => s.setSkipping);
  const history = useDialogueStore((s) => s.history);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 1800);
  };

  const camera = currentNode && 'camera' in currentNode ? currentNode.camera : undefined;
  const transition = currentNode && 'transition' in currentNode ? currentNode.transition : undefined;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--color-void)]">
      <Camera instruction={camera}>
        <Background backgroundId={backgroundId} />
        <CharacterLayer characters={stageCharacters} />
      </Camera>

      <ScreenFade active={transition?.type === 'flash'} />

      <TopBar
        onLog={() => setHistoryOpen(true)}
        onSave={() => navigate('/save')}
        onSettings={() => navigate('/settings')}
        onMenu={() => navigate('/pause')}
      />

      <BottomBar
        isSkipping={isSkipping}
        onSkip={() => setSkipping(!isSkipping)}
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
