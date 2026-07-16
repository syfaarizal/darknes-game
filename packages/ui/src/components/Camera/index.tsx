import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CameraEngine } from '@darknes/engine';
import type { CameraInstruction } from '@darknes/shared';

export interface CameraProps {
  instruction?: CameraInstruction;
  children: ReactNode;
}

/** Wraps the background + character stage and applies the current scene's camera move. */
export function Camera({ instruction, children }: CameraProps) {
  const target = CameraEngine.resolveCameraTarget(instruction);

  return (
    <motion.div
      className="absolute inset-0"
      animate={target.animate}
      transition={target.transition}
    >
      {children}
    </motion.div>
  );
}
