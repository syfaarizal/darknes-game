import { motion } from 'framer-motion';

export interface MenuItem {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
}

/** Vertical menu stack used by MainMenu / Pause. First item renders as the primary CTA. */
export function Menu({ items }: MenuProps) {
  return (
    <nav className="flex w-full max-w-[24rem] flex-col items-stretch gap-3">
      {items.map((item) => {
        return (
          <motion.button
            key={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            className="group w-full rounded-none border border-[rgba(255,255,255,0.12)] bg-transparent px-5 py-4 text-left font-body text-sm uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-[var(--color-accent-strong)] hover:bg-[var(--color-accent-strong)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="block">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
