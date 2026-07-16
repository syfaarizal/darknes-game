import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimationEngine } from '@darknes/engine';
import type { SceneTransition as SceneTransitionInstruction } from '@darknes/shared';

export interface SceneTransitionProps {
  transitionKey: string;
  transition?: SceneTransitionInstruction;
  children: ReactNode;
}

export function SceneTransition({ transitionKey, transition, children }: SceneTransitionProps) {
  const variant = AnimationEngine.resolveTransitionVariant(transition);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        transition={variant.transition}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
