export interface NameBoxProps {
  name: string;
  color?: string;
}

export function NameBox({ name, color = 'var(--color-accent-strong)' }: NameBoxProps) {
  return (
    <div className="mb-1 inline-flex items-center gap-2 px-1">
      <span
        className="font-display text-sm tracking-[0.12em] uppercase"
        style={{ color }}
      >
        {name}
      </span>
    </div>
  );
}
