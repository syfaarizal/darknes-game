import { motion, AnimatePresence } from 'framer-motion';
import { CharacterPosition } from '@darknes/shared';
import type { CharacterStageState } from '@darknes/shared';
import { resolveCharacterExpressionUrl } from '@darknes/assets';

const POSITION_CLASSES: Record<CharacterPosition, string> = {
  [CharacterPosition.FarLeft]: 'left-[2%]',
  [CharacterPosition.Left]: 'left-[5%]',
  [CharacterPosition.Center]: 'left-1/2 -translate-x-1/2',
  [CharacterPosition.Right]: 'right-[5%]',
  [CharacterPosition.FarRight]: 'right-[2%]',
  [CharacterPosition.Offscreen]: 'opacity-0 pointer-events-none',
};

export interface CharacterLayerProps {
  characters: CharacterStageState[];
}

export function CharacterLayer({ characters }: CharacterLayerProps) {
  const visibleCharacters = Array.isArray(characters) ? characters : [];

  return (
    <div className="absolute inset-0">
      <AnimatePresence>
        {visibleCharacters
          .filter((c) => c.position !== CharacterPosition.Offscreen)
          .map((c) => (
            <CharacterPortrait key={c.characterId} state={c} />
          ))}
      </AnimatePresence>
    </div>
  );
}

function CharacterPortrait({ state }: { state: CharacterStageState }) {
  // Prefer explicit image path from scene data; fall back to expression-based URL.
  const imagePath = state.image
    ? state.image
    : resolveCharacterExpressionUrl(state.characterId, state.expression);
  const positionClass =
    state.position === CharacterPosition.Center
      ? 'center left-[10rem] -translate-x-1/2 w-auto'
      : POSITION_CLASSES[state.position];

  return (
    <motion.img
      src={imagePath}
      alt={state.characterId}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1.08,
        filter: 'brightness(1)',
      }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute bottom-0 h-[95%] object-contain object-bottom mx-auto ${positionClass}`}
    />
  );
}
