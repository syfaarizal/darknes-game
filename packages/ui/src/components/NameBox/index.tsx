export interface NameBoxProps {
  name: string;
  color?: string;
}

/**
 * Character name label displayed above dialogue.
 * Uses EB Garamond SemiBold for a refined, literary feel —
 * matching the aristocrat / noir aesthetic.
 */
export function NameBox({ name, color = 'var(--color-accent-strong)' }: NameBoxProps) {
  return (
    <div className="mb-1 inline-flex items-center gap-2 px-1">
      <span
        className="font-character text-[15px] font-semibold italic tracking-[0.08em] uppercase"
        style={{ color }}
      >
        {name}
      </span>
    </div>
  );
}
