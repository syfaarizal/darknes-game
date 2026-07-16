import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { HistoryEntry } from '@darknes/shared';
import { IconButton } from '../Buttons';

export interface HistoryLogProps {
  open: boolean;
  entries: HistoryEntry[];
  onClose: () => void;
}

export function HistoryLog({ open, entries, onClose }: HistoryLogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col bg-[var(--color-void)]/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
            <h2 className="font-display text-lg tracking-[0.15em] text-[var(--color-ink)]">
              HISTORY
            </h2>
            <IconButton icon={<X size={18} />} label="Close" onClick={onClose} />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {entries.length === 0 && (
              <p className="text-sm text-[var(--color-ink-faint)]">Nothing said yet.</p>
            )}
            <ul className="space-y-4">
              {entries.map((entry, i) => (
                <li key={`${entry.nodeId}-${i}`} className="border-b border-[var(--color-hairline)] pb-3">
                  {entry.speaker && (
                    <p className="mb-1 font-display text-xs uppercase tracking-[0.1em] text-[var(--color-accent-strong)]">
                      {entry.speaker}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {entry.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
