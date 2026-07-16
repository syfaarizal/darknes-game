import type { ReactNode } from 'react';
import { GhostButton } from '../Buttons';

export interface DialogueBoxProps {
  children: ReactNode;
  onNext: () => void;
  onToggleLog: () => void;
  onToggleAuto: () => void;
  isAutoMode: boolean;
  isAdvanceable: boolean;
}

export function DialogueBox({
  children,
  onNext,
  onToggleLog,
  onToggleAuto,
  isAutoMode,
  isAdvanceable,
}: DialogueBoxProps) {
  return (
    <div
      onClick={() => isAdvanceable && onNext()}
      className="relative mx-auto w-[90%] max-w-4xl cursor-pointer border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-6 py-5 backdrop-blur-md"
      style={{ borderRadius: 'var(--radius-panel)' }}
    >
      <div className="min-h-[4.5rem] font-body text-[15px] leading-relaxed text-[var(--color-ink)]">
        {children}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs tracking-[0.1em] text-[var(--color-ink-muted)]">
        <div className="flex gap-4">
          <GhostButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleAuto();
            }}
            className={`!p-0 uppercase ${isAutoMode ? 'text-[var(--color-accent-strong)]' : ''}`}
          >
            Auto
          </GhostButton>
          <GhostButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleLog();
            }}
            className="!p-0 uppercase"
          >
            Log
          </GhostButton>
        </div>
        {isAdvanceable && (
          <span className="uppercase text-[var(--color-ink-muted)]">Next &rsaquo;</span>
        )}
      </div>
    </div>
  );
}
