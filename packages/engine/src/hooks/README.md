# engine/hooks

The only React-aware code in `@darknes/engine`. Thin adapters over the
Zustand stores and engine modules:

- `useDialogueRunner` — the main hook for the gameplay screen: current
  node, typewriter/choice state, and `begin/next/pick` actions.
- `useTypewriter` — derives the currently-revealed substring of a line.
- `useSceneLoader` — boot-time wiring that tells `SceneEngine` where this
  app's scene JSON files live and registers character metadata.
