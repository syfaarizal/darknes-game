import type { ReactNode } from 'react';
import { GhostButton } from '../Buttons';

export interface DialogueBoxProps {
  children: ReactNode;
  onNext: () => void;
  onToggleLog: () => void;
  onToggleAuto: () => void;
  isAutoMode: boolean;
  isAdvanceable: boolean;
  name?: string;
  nameColor?: string;
}

export function DialogueBox({
  children,
  onNext,
  onToggleLog,
  onToggleAuto,
  isAutoMode,
  isAdvanceable,
  name,
  nameColor = 'var(--color-accent-strong)',
}: DialogueBoxProps) {
  return (
    <div
      onClick={() => isAdvanceable && onNext()}
      className="relative mx-auto w-[90%] max-w-4xl cursor-pointer border border-[var(--color-glass-border)] bg-[var(--color-glass-fill)] px-6 pt-5 pb-4 backdrop-blur-md"
      style={{ borderRadius: 'var(--radius-panel)' }}
    >
      {name && (
        <div className="mb-3 flex items-center gap-3">
          <div
            className="shrink-0 border-b-2 px-1 pb-0.5 font-display text-sm tracking-[0.14em] uppercase"
            style={{ color: nameColor, borderColor: nameColor }}
          >
            {name}
          </div>
          <div className="h-px flex-1 border-t border-[var(--color-glass-border)]" />
        </div>
      )}

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
