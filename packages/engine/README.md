# @darknes/engine

The reusable Visual Novel runtime: state stores plus the "engines" that read
scene JSON and turn it into stage state, audio, camera moves, and save data.
This package has **no UI** — it is deliberately framework-thin so a second
game (`apps/game-2`) or a future non-React shell could reuse it.

## Layout

- `store/` — Zustand stores: `gameStore`, `settingsStore`, `audioStore`,
  `sceneStore`, `dialogueStore`, `saveStore`. Each store owns one concern
  only; engines read/write stores, components read stores via hooks.
- `engines/` — One folder per system (see each folder's own README):
  `StoryEngine`, `SceneEngine`, `DialogueEngine`, `ChoiceEngine`,
  `CharacterEngine`, `BackgroundEngine`, `CameraEngine`, `AudioEngine`,
  `SaveEngine`, `AnimationEngine`, plus the **prepared-only** extension
  points `EffectEngine`, `VoiceEngine`, `InputEngine`.
- `hooks/` — React hooks (`useDialogueRunner`, `useTypewriter`,
  `useSceneLoader`) that are the *only* React-aware code in this package —
  thin adapters over the stores/engines above.

## Data flow

```
scene JSON (data/scenes/*.json)
        │  SceneEngine.loadScene()
        ▼
   sceneStore  ──┐
        │        │  StoryEngine.advance()
        ▼        │
  dialogueStore ◄─┘── DialogueEngine / ChoiceEngine mutate the current node
        │
        ▼
  React components (packages/ui) subscribe via hooks and render
```

`gameStore` holds cross-cutting state (phase, flags, variables, current
scene/node id). `saveStore` snapshots `gameStore` + `dialogueStore.history`
into a `SaveFilePayload` (see `@darknes/shared`) and persists it via
`SaveEngine`.

## Extension points (prepared, not implemented)

Per the project brief, `EffectEngine` (particles/fog/rain/snow/screen
shake/flash), `VoiceEngine` (voice-over playback + lip sync + blink
animation), and `InputEngine` (gamepad/controller support) export typed
interfaces and no-op implementations only. Wiring real behavior into them
is future work — see each folder's README for the intended shape.
