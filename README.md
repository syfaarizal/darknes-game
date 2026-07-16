# DARKNES — Interactive Novel Game

A cinematic, dark-luxury-mafia visual novel, built as **a reusable engine
first, a game second**. DARKNES (the game) is the first project to run on
top of a general-purpose Visual Novel engine that a second game could reuse
without a rewrite.

Tech stack: **React, TypeScript, Vite, TailwindCSS, Framer Motion, Zustand,
React Router, Howler.js**, with **PixiJS** installed and reserved (not yet
wired) for future particle/weather effects.

---

## 1. Why this is a monorepo

The engine (`packages/engine`), the visual novel component library
(`packages/ui`), the asset registry (`packages/assets`), and shared
types/constants (`packages/shared`) are all published as independent
workspace packages that `apps/game` consumes like any other dependency.

```
darknes/
├── apps/
│   └── game/              # the actual DARKNES game (Vite + React app)
├── packages/
│   ├── engine/             # stores + engines: the VN runtime, no UI
│   ├── ui/                 # presentational components, no gameplay logic
│   ├── assets/             # typed asset manifest + loaders
│   └── shared/              # types, enums, constants, pure utils
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Why this matters:** the day a second game (a period-drama, a horror
story, a sci-fi thriller — whatever) is greenlit, it becomes
`apps/game-2`, importing the exact same `engine`/`ui`/`shared` packages.
Nothing in those four packages hardcodes anything about Nathael, Damian,
Alaric, Azaroth, or the mafia setting — all of that lives in `apps/game`'s
`src/data/`.

### A note on the package manager

This repo uses **pnpm workspaces + Turborepo**, not plain `npm`. Cross-package
dependencies use the `workspace:*` protocol, which pnpm (and Yarn) resolve
via symlinks; plain `npm install` does not understand that protocol the same
way. If your environment only has `npm`, install `pnpm` first
(`npm install -g pnpm`) — everything else works exactly as described below.

---

## 2. Installation

```bash
pnpm install
pnpm dev
```

That's it — `pnpm dev` starts `apps/game` on `http://localhost:5173`.

Other useful root-level scripts (all fan out across every package via
Turborepo, with caching):

```bash
pnpm build       # production build of every package + the game
pnpm typecheck    # tsc --noEmit across the whole repo
pnpm lint         # eslint across the whole repo
pnpm format       # prettier --write everything
```

To work on a single package directly: `pnpm --filter @darknes/engine typecheck`,
`pnpm --filter @darknes/game dev`, etc.

---

## 3. Folder-by-folder

Every folder in this repo — including empty ones — has its own `README.md`
explaining its purpose in place; this section is the map of the territory.

### `packages/shared`
Framework-agnostic types (`SceneFile`, `SceneNode`, `CharacterDefinition`,
`SaveFilePayload`, …), string enums (`SceneTransitionType`,
`CharacterPosition`, `DialogueNodeType`, …), constants (storage keys,
default volumes, text-speed timings), and pure utility functions (id
generation, condition evaluation, clamping). Nothing here imports React.

### `packages/assets`
The typed registry mapping short ids (`"office"`, `"nathael.serious"`) to
file paths, plus loaders that resolve those ids to real URLs and preload
images. Also ships on-brand inline SVG/gradient **placeholders** so every
screen looks intentional before real art exists.

### `packages/engine`
The VN runtime: six Zustand stores (`game`, `settings`, `audio`, `scene`,
`dialogue`, `save`) and thirteen "engines" — one per system
(`StoryEngine`, `SceneEngine`, `DialogueEngine`, `ChoiceEngine`,
`CharacterEngine`, `BackgroundEngine`, `CameraEngine`, `AudioEngine`,
`SaveEngine`, `AnimationEngine`, plus the prepared-only `EffectEngine`,
`VoiceEngine`, `InputEngine`). Also home to the three React hooks
(`useDialogueRunner`, `useTypewriter`, `useSceneLoader`) that bridge stores
to components. See `packages/engine/README.md` for the full data-flow
diagram.

### `packages/ui`
Every visual piece of the in-game HUD as a presentational component:
`Background`, `Character`, `Camera`, `SceneTransition`, `ScreenFade`,
`Typewriter`, `NameBox`, `DialogueBox`, `ChoiceBox`, `Dialogue` (the
composite), `TopBar`, `BottomBar`, `History`, `Notification`, `Menu`,
`Buttons`, `Settings`. Styled entirely from `styles/tokens.css` — no
component hardcodes a color.

### `apps/game`
The actual DARKNES game: `app/` (composition root wiring engine to this
game's data), `router/` (React Router config for all 9 screens), `pages/`
(`Splash`, `MainMenu`, `Game`, `Pause`, `Settings`, `Load`, `Save`,
`Ending`, `Credits`), `data/` (scene JSON, character JSON, endings,
variables, flags), and `public/assets/` (the real art/audio tree).

---

## 4. Architecture — how a click becomes a story beat

```
Player clicks the dialogue box
        │
        ▼
pages/Game → useDialogueRunner().next()
        │
        ▼
StoryEngine.advance()  — reads dialogueStore.currentNode
        │
        ▼
goToNode() → SceneEngine.getNodeById() finds the next SceneNode
        │
        ▼
processNode() switches on node.type:
  line/narration → CharacterEngine.applyLineToStage()
                  → DialogueEngine.runTypewriter()
                  → DialogueEngine.recordHistory()
  choice         → ChoiceEngine.presentChoices()
  scene-change    → StoryEngine.startScene(newId)
  set-flag/var    → gameStore mutations
  conditional     → evaluateConditions() picks ifTrue/ifFalse
  end             → gameStore.setPhase(Ending)
        │
        ▼
Zustand stores update → subscribed components re-render
(DialogueLayer, Background, CharacterLayer, ChoiceBox, …)
```

No React component ever inspects a node's `type` except `Dialogue`'s
composite component, and no component ever mutates a store directly for
gameplay purposes — everything routes through `StoryEngine`.

---

## 5. How Scene JSON works

See `apps/game/src/data/scenes/README.md` for the full node-type reference.
The short version: a scene is `{ meta, nodes[] }`; `StoryEngine` walks
`nodes` starting at `meta.entry`, following each node's `next` (or
choice/conditional branching) until it hits an `end` node or a
`scene-change`. **No dialogue text lives in a `.tsx` file, ever.**

`scene04.json` is a complete worked example: narration → line → choice (3
options, each setting different flags/variables) → conditional branch →
two possible closing lines → end. Read it alongside
`packages/engine/src/engines/StoryEngine/index.ts` to see exactly how each
piece is interpreted.

## 6. How characters work

`data/characters/*.json` define each character's id, display name, title,
name-tag color, and available expression keys — this is metadata, not
art. `CharacterEngine.registerCharacters()` loads these once at boot (see
`app/App.tsx`). A scene node then either sets a full `characters[]` stage
directive (position + expression + speaking flag for everyone on screen)
or, for the common case, just sets `speaker` + `expression` and lets
`CharacterEngine.applyLineToStage` update only that one character.

The player character, **Xyera**, intentionally has no entry here — she's
written as first-person and never rendered as a portrait.

## 7. How backgrounds work

`packages/assets/src/manifest/index.ts`'s `BACKGROUNDS` map is the single
source of truth from background id → file path. `BackgroundEngine` just
sets `sceneStore.backgroundId`; the `ui` package's `<Background>` component
resolves that id to a URL and cross-fades to it.

## 8. How audio will work

`AudioEngine` is a thin Howler.js wrapper, one `Howl` instance per audio
id, organized by `AudioChannel` (`music`/`sfx`/`voice`/`ambience`/`ui`).
`playCue`/`stopCue` handle fading in/out using `settingsStore`'s per-channel
volume. Scene nodes reference audio by id via the `audio: AudioCue[]`
field; `AUDIO_TRACKS` in `packages/assets` currently starts empty —
register real tracks there as files are added to
`public/assets/audio/{music,sfx,voice}/`.

## 9. How voice will work (prepared, not implemented)

`VoiceEngine` (`packages/engine/src/engines/VoiceEngine`) defines the
target shape — `playLine`, `getLipSyncFrames`, `isBlinkEnabled` — without a
real implementation yet. Voice clips can already play today as plain
`AudioChannel.Voice` cues through `AudioEngine`; what's missing is
amplitude-driven lip sync and blink timing, which is future work layered
on top.

## 10. How future assets are added

1. Drop the file into the matching `public/assets/**` subfolder (see that
   folder's own `README.md` for naming conventions).
2. Register it in `packages/assets/src/manifest/index.ts`
   (`BACKGROUNDS`, `CHARACTERS`, or `AUDIO_TRACKS`).
3. Reference it by id from scene JSON or component props — never by raw
   path.

## 11. Naming convention

- Scene ids: `sceneNN` (zero-padded to 2 digits), matching the filename.
- Node ids: `<sceneId>_<shortLabel>` (e.g. `s04_n001`, `s04_end_good`) —
  unique per scene, not globally.
- Character ids: lowercase, no spaces (`nathael`, not `Nathael`).
- Expression keys: lowercase adjectives (`neutral`, `smile`, `serious`).
- Background ids: kebab-case matching the folder name (`living-room`).
- Flags: `camelCase` booleans describing a fact (`toldTruth`,
  `walkedAway`).
- Variables: `camelCase` nouns tracking a quantity (`trustNathael`,
  `suspicionLevel`).

## 12. Best practices

- **Never hardcode dialogue, colors, or file paths in `.tsx` files.** Text
  comes from scene JSON, color comes from `tokens.css`/character JSON,
  paths come from the asset manifest.
- **Stores own one concern each.** If you're tempted to read `gameStore`
  from inside `sceneStore`, that logic belongs in an engine module instead.
- **UI components stay dumb.** `packages/ui` should never import
  `StoryEngine` — it calls the hooks (`useDialogueRunner`) and lets `engine`
  own the orchestration.
- **New engine systems get their own folder + README**, following the
  existing thirteen. Keep the "prepared, not implemented" pattern
  (`EffectEngine`, `VoiceEngine`) for anything explicitly out of scope for
  now — a typed no-op API is worth writing even before the real
  implementation.

## 13. Future roadmap

Explicitly prepared-for, not yet built (per the original project brief):

- **Voice Over, Lip Sync, Blink Animation** — `VoiceEngine`
- **Particles, Fog, Rain, Snow, Screen Shake, Flash** — `EffectEngine` /
  PixiJS (installed, unused)
- **CG Gallery, Achievements** — new `pages/` + a small unlock-tracking
  store
- **Controller Support** — `InputEngine.gamepadEngine`
- **Steam, Cloud Save** — `apps/game/src/services`
- **Localization** — a future `i18n` package following the same
  "framework-agnostic core + thin React hook" pattern as `engine`
- **A second game** (`apps/game-2`) reusing `engine`/`ui`/`shared` as-is
