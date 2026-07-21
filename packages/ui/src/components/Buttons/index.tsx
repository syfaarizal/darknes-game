import type { ReactNode, MouseEventHandler } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useSfxClick } from '@darknes/engine';

type BaseProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children: ReactNode;
};

const baseClasses =
  'font-body tracking-[0.08em] uppercase text-sm transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none';

function useButtonClickHandler(
  onClick: MouseEventHandler<HTMLButtonElement> | undefined,
): MouseEventHandler<HTMLButtonElement> {
  const { playClick } = useSfxClick();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    playClick();
    onClick?.(e);
  };

  return handleClick;
}

export function PrimaryButton({ children, className = '', onClick, ...rest }: BaseProps) {
  const handleClick = useButtonClickHandler(onClick);

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`${baseClasses} bg-[var(--color-accent)] text-[var(--color-ink)] px-6 py-3 border border-[var(--color-accent-strong)] hover:bg-[var(--color-accent-strong)] ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, className = '', onClick, ...rest }: BaseProps) {
  const handleClick = useButtonClickHandler(onClick);

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`${baseClasses} bg-transparent text-[var(--color-ink)] px-6 py-3 border border-[var(--color-hairline)] hover:border-[var(--color-ink-muted)] hover:bg-[var(--color-graphite)] ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, className = '', onClick, ...rest }: BaseProps) {
  const handleClick = useButtonClickHandler(onClick);

  return (
    <motion.button
      onClick={handleClick}
      className={`${baseClasses} bg-transparent text-[var(--color-ink-muted)] px-3 py-2 hover:text-[var(--color-ink)] ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

type IconButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  icon: ReactNode;
  label: string;
};

export function IconButton({ icon, label, className = '', onClick, ...rest }: IconButtonProps) {
  const handleClick = useButtonClickHandler(onClick);

  return (
    <motion.button
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08 }}
      onClick={handleClick}
      className={`p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 ${className}`}
      {...rest}
    >
      {icon}
    </motion.button>
  );
}
