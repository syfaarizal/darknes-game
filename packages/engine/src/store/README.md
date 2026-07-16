# engine/store

Zustand stores, one per concern. No store imports another store directly —
cross-store orchestration happens in `engines/` (e.g. `StoryEngine` reads
`sceneStore` and writes `dialogueStore` and `gameStore`), keeping each store
testable in isolation.

| Store            | Owns                                                        |
| ---------------- | ------------------------------------------------------------ |
| `gameStore`      | phase, current scene/node id, flags, variables               |
| `settingsStore`  | audio volumes, text speed, auto-mode delay, fullscreen — persisted to `localStorage` |
| `audioStore`     | which Howler track ids are currently active, per channel     |
| `sceneStore`     | the loaded `SceneFile`, current background id, on-stage characters |
| `dialogueStore`  | current node, typewriter progress, pending choices, history, auto/skip flags |
| `saveStore`      | in-memory list of save slots, mirrors what `SaveEngine` has persisted |
