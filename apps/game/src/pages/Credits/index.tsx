import { useNavigate } from 'react-router-dom';
import { GhostButton } from '@darknes/ui';

export function Credits() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-[var(--color-void)] text-center">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-[var(--color-accent-strong)]">
        Credits
      </p>
      <h1 className="mb-6 font-display text-3xl uppercase tracking-[0.15em] text-[var(--color-ink)]">
        Darknes
      </h1>
      <p className="text-sm text-[var(--color-ink-muted)]">Written &amp; Directed — Seika Ryu</p>
      <p className="text-sm text-[var(--color-ink-muted)]">Engine &amp; Engineering — Kai Shi</p>
      <p className="mb-8 text-sm text-[var(--color-ink-muted)]">Built with the DARKNES VN Engine</p>
      <GhostButton onClick={() => navigate('/menu')}>Back to Menu</GhostButton>
    </div>
  );
}
