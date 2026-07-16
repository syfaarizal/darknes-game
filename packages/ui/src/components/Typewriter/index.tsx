import { useTypewriter } from '@darknes/engine';

export interface TypewriterProps {
  text: string;
  className?: string;
}

/** Renders `text` progressively as `dialogueStore.revealedCharCount` advances. */
export function Typewriter({ text, className = '' }: TypewriterProps) {
  const { visibleText, isDone } = useTypewriter(text);

  return (
    <span className={className}>
      {visibleText}
      {!isDone && <span className="ml-0.5 inline-block w-[1px] animate-pulse bg-current" />}
    </span>
  );
}
