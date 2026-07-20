import { motion } from 'framer-motion';

export interface MenuItem {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
}

/**
 * Elegant, cinematic vertical menu.
 *
 * Primary — full-width underline bar with crimson accent, animated on hover.
 * Ghost    — minimal underline, letter-spacing reveal on hover.
 *
 * Reference: Death Stranding / The Order 1886 / John Wick title cards.
 */
export function Menu({ items }: MenuProps) {
  return (
    <nav className="flex w-full max-w-[22rem] flex-col items-stretch gap-1">
      {items.map((item) => {
        const isPrimary = item.variant === 'primary';

        return (
          <motion.button
            key={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            whileHover="hover"
            whileTap="tap"
            initial="rest"
            className="group relative flex items-center gap-4 py-3 text-left
              disabled:cursor-not-allowed disabled:opacity-30"
          >
            {/* ── Primary: full underline bar ── */}
            {isPrimary && (
              <motion.span
                variants={{
                  rest:  { scaleX: 1, opacity: 0.9 },
                  hover: { scaleX: 1, opacity: 1   },
                }}
                className="absolute inset-x-0 bottom-0 -mb-1 block h-px origin-left
                  bg-[var(--color-accent-strong)]"
              />
            )}

            {/* ── Ghost: minimal underline reveal ── */}
            {!isPrimary && (
              <motion.span
                variants={{
                  rest:  { scaleX: 0, opacity: 0 },
                  hover: { scaleX: 1, opacity: 0.5 },
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-0 -mb-1 block h-px origin-left
                  bg-[var(--color-hairline)]"
              />
            )}

            {/* ── Label ── */}
            <motion.span
              variants={{
                rest:  { x: 0,    color: 'var(--color-ink-muted)', letterSpacing: '0.14em' },
                hover: { x: 10,   color: 'var(--color-ink)',        letterSpacing: '0.22em' },
                tap:   { x: 6,    color: 'var(--color-ink)' },
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`font-body text-sm uppercase
                ${isPrimary ? 'font-medium text-[var(--color-accent-strong)]' : ''}`}
            >
              {item.label}
            </motion.span>

            {/* ── Right arrow indicator (ghost only) ── */}
            {!isPrimary && (
              <motion.span
                variants={{
                  rest:  { x: 0,    opacity: 0 },
                  hover: { x: 0,    opacity: 0.5 },
                }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 font-body text-xs text-[var(--color-ink-muted)]"
              >
                &rsaquo;
              </motion.span>
            )}

            {/* ── Primary: left accent pip ── */}
            {isPrimary && (
              <motion.span
                variants={{
                  rest:  { scaleX: 0, opacity: 0 },
                  hover: { scaleX: 1, opacity: 1   },
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -left-4 top-1/2 -translate-y-1/2 block h-4 w-px
                  origin-left bg-[var(--color-accent-strong)]"
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
