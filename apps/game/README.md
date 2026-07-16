# @darknes/game

The DARKNES game itself — a thin Vite + React app that wires
`@darknes/engine` and `@darknes/ui` to this story's actual content
(`src/data/`). See the root `README.md` for full architecture docs; this
file covers only what's specific to running/building this app.

## Scripts

```bash
pnpm --filter @darknes/game dev        # http://localhost:5173
pnpm --filter @darknes/game build      # outputs to dist/
pnpm --filter @darknes/game preview    # preview the production build
```

## Entry points worth knowing

- `src/main.tsx` — mounts React, configures the asset base URL.
- `src/app/App.tsx` — boots `SceneEngine`/`CharacterEngine` with this
  game's data, then renders the router.
- `src/router/index.tsx` — the 9-screen game flow.
- `src/data/` — everything a writer/designer would touch: scene JSON,
  character JSON, endings, variables, flags.
- `public/assets/` — everything an artist/sound designer would touch.
