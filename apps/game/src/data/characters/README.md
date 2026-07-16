# data/characters

One JSON file per character, matching the `CharacterDefinition` type from
`@darknes/shared`: id, display name, title, name-tag color, and the list of
available expression keys. `App.tsx` imports all four at boot and passes
them to `useSceneLoader`, which registers them with `CharacterEngine`.

To add a new character: drop portraits into
`assets/characters/<id>/<expression>.webp`, add a matching entry to
`packages/assets/src/manifest/index.ts`, then create
`data/characters/<id>.json` here following the same shape.
