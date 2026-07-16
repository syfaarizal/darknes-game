# public/assets

Served as-is at `/assets/*` in dev and production (Vite convention for
`public/`). This is where every real binary asset the game references
lives. Nothing in this project generates art or audio — drop real files
into the matching subfolder below, then register them in
`packages/assets/src/manifest/index.ts` so the engine can resolve them by
id instead of by path. Until real files exist, `@darknes/assets`'s
`loaders/placeholders.ts` renders on-brand inline SVG/gradient stand-ins.
