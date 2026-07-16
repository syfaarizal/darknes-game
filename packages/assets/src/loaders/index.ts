import { AUDIO_TRACKS, BACKGROUNDS, CHARACTERS } from '../manifest';

/**
 * Base URL that real asset files are served from. The `game` app points
 * this at `/assets` (see `apps/game/public/assets` or a CDN in production).
 * Set once at boot via `configureAssetBaseUrl`.
 */
let assetBaseUrl = '/assets';

export function configureAssetBaseUrl(url: string): void {
  assetBaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
}

function join(path: string): string {
  return `${assetBaseUrl}/${path}`;
}

export function resolveBackgroundUrl(backgroundId: string): string {
  const entry = BACKGROUNDS[backgroundId];
  if (!entry) {
    console.warn(`[assets] Unknown background id "${backgroundId}"`);
    return join('backgrounds/_missing.webp');
  }
  return join(entry.path);
}

export function resolveCharacterExpressionUrl(characterId: string, expression: string): string {
  const key = `${characterId}.${expression}`;
  const entry = CHARACTERS[key];
  if (!entry) {
    console.warn(`[assets] Unknown character expression "${key}"`);
    return join(`characters/${characterId}/neutral.webp`);
  }
  return join(entry.path);
}

export function resolveAudioUrl(audioId: string): string | null {
  const entry = AUDIO_TRACKS[audioId];
  if (!entry) {
    console.warn(`[assets] Unknown audio id "${audioId}"`);
    return null;
  }
  return join(entry.path);
}

/** Preloads a single image, resolving once it has decoded (or errored). */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(preloadImage));
}

export * from './placeholders';
