# app

The composition root. `App.tsx` is the one place that wires
`@darknes/engine`'s generic `SceneEngine`/`CharacterEngine` to this specific
game's data files (`src/data/scenes`, `src/data/characters`) via
`useSceneLoader`, then hands off to the router. A second game would only
need to replace this file's imports to reuse the entire engine + ui stack.
