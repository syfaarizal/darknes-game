# engine/engines/SceneEngine

Loads scene JSON files. Doesn't know where files live on disk — the game app injects a resolver via `configureSceneResolver` (e.g. backed by Vite's `import.meta.glob('/src/data/scenes/*.json')`), so a second game can point this at its own scene folder.
