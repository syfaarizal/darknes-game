import { motion, AnimatePresence } from 'framer-motion';
import { CharacterPosition } from '@darknes/shared';
import type { CharacterStageState } from '@darknes/shared';
import { resolveCharacterExpressionUrl } from '@darknes/assets';

const POSITION_CLASSES: Record<CharacterPosition, string> = {
  [CharacterPosition.FarLeft]: 'left-[23rem]',
  [CharacterPosition.Left]: 'left-[23rem]',
  [CharacterPosition.Center]: 'left-[23rem]',
  [CharacterPosition.Right]: 'left-[23rem]',
  [CharacterPosition.FarRight]: 'left-[23rem]',
  [CharacterPosition.Offscreen]: 'opacity-0 pointer-events-none',
};

export interface CharacterLayerProps {
  characters: CharacterStageState[];
}

export function CharacterLayer({ characters }: CharacterLayerProps) {
  return (
    <div className="absolute inset-0">
      <AnimatePresence>
        {characters
          .filter((c) => c.position !== CharacterPosition.Offscreen)
          .map((c) => (
            <CharacterPortrait key={c.characterId} state={c} />
          ))}
      </AnimatePresence>
    </div>
  );
}

function CharacterPortrait({ state }: { state: CharacterStageState }) {
  const url = resolveCharacterExpressionUrl(state.characterId, state.expression);
  const positionClass = POSITION_CLASSES[state.position];

  return (
    <motion.img
      src={url}
      alt={state.characterId}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: state.isSpeaking === false ? 0.55 : 1,
        y: 0,
        filter: state.isSpeaking === false ? 'brightness(0.6) saturate(0.7)' : 'brightness(1)',
      }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute bottom-0 h-[99%] object-contain object-bottom ${positionClass}`}
    />
  );
}
