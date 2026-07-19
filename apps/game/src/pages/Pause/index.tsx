import { useNavigate } from 'react-router-dom';
import { Menu } from '@darknes/ui';
import { useGameStore } from '@darknes/engine';

export function Pause() {
  const navigate = useNavigate();
  const playerName = useGameStore((s) => s.playerName);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-void)]/90 backdrop-blur-sm">
      <div className="w-full max-w-xs">
        <h2 className="mb-1 text-center font-display text-2xl uppercase tracking-[0.2em] text-[var(--color-ink)]">
          Paused
        </h2>
        <p className="mb-8 text-center font-body text-xs text-[var(--color-ink-muted)]">
          {playerName || 'Player'}
        </p>
        <Menu
          items={[
            { label: 'Resume', onClick: () => navigate('/game'), variant: 'primary' },
            { label: 'Save', onClick: () => navigate('/save'), variant: 'ghost' },
            { label: 'Load', onClick: () => navigate('/load'), variant: 'ghost' },
            { label: 'Settings', onClick: () => navigate('/settings'), variant: 'ghost' },
            { label: 'Main Menu', onClick: () => navigate('/menu'), variant: 'ghost' },
          ]}
        />
      </div>
    </div>
  );
}
