import { forwardRef } from 'react';

export interface PlayerNameInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Premium input field for the player name.
 * Styled to match the DARKNES dark luxury aesthetic.
 */
export const PlayerNameInput = forwardRef<HTMLInputElement, PlayerNameInputProps>(
  ({ id = 'player-name-input', value, onChange, onEnter, disabled = false, className = '' }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        <label
          htmlFor={id}
          className="mb-3 block font-display text-xs uppercase tracking-[0.25em] text-[var(--color-ink-muted)]"
        >
          Name
        </label>

        {/* Input field */}
        <input
          ref={ref}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEnter?.();
            }
          }}
          disabled={disabled}
          placeholder="Enter your name..."
          autoComplete="off"
          spellCheck={false}
          maxLength={20}
          className="
            w-full
            border border-[var(--color-hairline)]
            bg-[var(--color-charcoal)]
            px-5 py-4
            font-body text-base text-[var(--color-ink)]
            placeholder:text-[var(--color-ink-faint)]
            transition-colors duration-200
            focus:border-[var(--color-accent-strong)]
            focus:outline-none
            disabled:opacity-40 disabled:cursor-not-allowed
          "
          style={{ borderRadius: 'var(--radius-panel)' }}
        />
      </div>
    );
  },
);

PlayerNameInput.displayName = 'PlayerNameInput';
