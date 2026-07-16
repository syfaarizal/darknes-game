import { resolveBackgroundUrl } from '@darknes/assets';
import { useSceneStore } from '../../store/sceneStore';

export function setBackground(backgroundId: string): void {
  useSceneStore.getState().setBackground(backgroundId);
}

export function getBackgroundUrl(backgroundId: string | null): string | null {
  if (!backgroundId) return null;
  return resolveBackgroundUrl(backgroundId);
}
