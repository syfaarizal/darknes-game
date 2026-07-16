/**
 * On-brand (dark / glass / red-accent) inline placeholders, used whenever a
 * real asset hasn't been dropped into `assets/` yet. Nothing here is meant
 * to ship in the final game — it exists purely so every screen renders
 * something intentional instead of a broken image icon during development.
 */

export function placeholderBackgroundGradient(seed: string): string {
  const hue = Math.abs(hashString(seed)) % 30; // stay within warm/near-neutral range
  return `linear-gradient(160deg, hsl(${hue} 20% 6%) 0%, hsl(${hue} 15% 3%) 55%, #0a0a0a 100%)`;
}

export function placeholderCharacterSvg(initial: string, accent = '#B80000'): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#141414" />
      <circle cx="200" cy="230" r="110" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5" />
      <text x="200" y="260" font-family="Cinzel, serif" font-size="96" fill="${accent}"
        text-anchor="middle" dominant-baseline="middle">${initial.toUpperCase()}</text>
      <rect x="0" y="0" width="400" height="600" fill="none" stroke="#1c1c1c" stroke-width="6" />
    </svg>
  `.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
