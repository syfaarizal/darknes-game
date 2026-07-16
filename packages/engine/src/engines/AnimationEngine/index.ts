import { DEFAULT_TRANSITION_DURATION_MS, SceneTransitionType } from '@darknes/shared';
import type { SceneTransition } from '@darknes/shared';

export interface TransitionVariant {
  initial: Record<string, number>;
  animate: Record<string, number>;
  exit: Record<string, number>;
  transition: { duration: number };
}

/**
 * Turns a `SceneTransition` instruction into Framer-Motion-ready variants.
 * Lives here (not in `ui`) so both the `ui` package and any future
 * PixiJS-based transition renderer share the exact same timing values.
 */
export function resolveTransitionVariant(transition?: SceneTransition): TransitionVariant {
  const duration = (transition?.duration ?? DEFAULT_TRANSITION_DURATION_MS) / 1000;

  switch (transition?.type) {
    case SceneTransitionType.SlideLeft:
      return {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -60 },
        transition: { duration },
      };
    case SceneTransitionType.SlideRight:
      return {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 60 },
        transition: { duration },
      };
    case SceneTransitionType.Flash:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: Math.min(duration, 0.15) },
      };
    case SceneTransitionType.Cut:
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 },
      };
    case SceneTransitionType.CrossFade:
    case SceneTransitionType.Fade:
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration },
      };
  }
}
