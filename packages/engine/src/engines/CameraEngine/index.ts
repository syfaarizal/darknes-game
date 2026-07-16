import { CameraMoveType, DEFAULT_CAMERA_DURATION_MS } from '@darknes/shared';
import type { CameraInstruction } from '@darknes/shared';

/**
 * Framer-Motion-shaped animation target. `ui` package's `<Camera>` /
 * `<SceneStage>` components spread this directly into `animate` +
 * `transition` props, keeping this package free of a `motion` dependency.
 */
export interface CameraAnimationTarget {
  animate: { scale?: number; x?: number; y?: number };
  transition: { duration: number; ease: string };
}

export function resolveCameraTarget(instruction?: CameraInstruction): CameraAnimationTarget {
  const duration = (instruction?.duration ?? DEFAULT_CAMERA_DURATION_MS) / 1000;

  switch (instruction?.type) {
    case CameraMoveType.ZoomIn:
      return { animate: { scale: instruction.scale ?? 1.12 }, transition: { duration, ease: 'easeInOut' } };
    case CameraMoveType.ZoomOut:
      return { animate: { scale: instruction.scale ?? 1 }, transition: { duration, ease: 'easeInOut' } };
    case CameraMoveType.PanLeft:
      return { animate: { x: -40, scale: 1.05 }, transition: { duration, ease: 'easeInOut' } };
    case CameraMoveType.PanRight:
      return { animate: { x: 40, scale: 1.05 }, transition: { duration, ease: 'easeInOut' } };
    case CameraMoveType.Shake:
      return { animate: { x: 0 }, transition: { duration: 0.4, ease: 'easeInOut' } };
    case CameraMoveType.Punch:
      return { animate: { scale: 1.2 }, transition: { duration: 0.25, ease: 'circOut' } };
    case CameraMoveType.Static:
    default:
      return { animate: { scale: 1, x: 0, y: 0 }, transition: { duration, ease: 'easeInOut' } };
  }
}
