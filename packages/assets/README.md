# @darknes/assets

Central registry and loaders for every binary asset the game references:
backgrounds, character portraits/expressions, music, sfx, voice lines, fonts,
and UI chrome (buttons/icons/frames).

**This package never generates or ships art.** It only knows *where* assets
live and *how* to load them. Real files are expected on disk under
`darknes/assets/...` (see the project root `assets/` folder) — drop files in,
register them in the manifest, and every engine module (Background, Character,
Audio, Voice) can resolve them by id instead of by path.

## Structure

- `manifest/` — Typed registries (`BACKGROUNDS`, `CHARACTERS`, `AUDIO_TRACKS`)
  mapping short ids (`"office"`, `"nathael.serious"`) to file paths. This is
  the single source of truth other packages import from — never hardcode a
  path string in a component.
- `loaders/` — Small async helpers (`preloadImage`, `preloadImages`,
  `resolveBackgroundUrl`, `resolveCharacterExpressionUrl`,
  `resolveAudioUrl`) that turn manifest entries into browser-ready
  URLs/Promises, with Vite's `import.meta.glob` used so new files dropped
  into `assets/` are picked up automatically without editing code.

## Adding a new asset (naming convention)

- Backgrounds: `assets/backgrounds/<location>/<variant>.webp`, registered as
  id `"<location>"` or `"<location>.<variant>"`.
- Characters: `assets/characters/<characterId>/<expression>.webp`, e.g.
  `assets/characters/nathael/serious.webp` → id `"nathael.serious"`.
  Character metadata itself (display name, color, title) lives in
  `data/characters/*.json`, not here — this package only maps expression
  keys to files.
- Audio: `assets/audio/<music|sfx|voice>/<id>.mp3` (or `.ogg`).
- UI chrome: `assets/ui/<buttons|icons|frames|dialogue|choice|menu>/*.svg`.

## Placeholder assets

Until real art/audio exists, `loaders/placeholders.ts` exports small inline
SVG/CSS-gradient placeholders so every screen renders something on-brand
(dark, glass, red-accent) instead of a broken image icon.
