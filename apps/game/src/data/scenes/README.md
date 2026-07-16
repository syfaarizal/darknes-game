# data/scenes

Twelve scene files (`scene01.json`–`scene12.json`), one per story beat.
**Only `scene04.json` is a fleshed-out example** — it demonstrates every
node type the engine supports (narration, line, choice, conditional, end)
plus flags, variables, and a camera instruction. The rest are minimal,
valid placeholder scenes (one narration line, one dialogue line, end) so
the router/engine can be exercised end-to-end before real writing exists —
replace their `nodes` array with real content scene by scene.

## Schema (matches `SceneFile` in `@darknes/shared`)

```jsonc
{
  "meta": {
    "id": "scene04",              // must match the filename (minus .json)
    "title": "Human-readable title",
    "background": "office",       // id from packages/assets manifest
    "music": "office-tension",    // optional, id from AUDIO_TRACKS
    "entry": "s04_n001"           // node id playback starts at
  },
  "nodes": [ /* SceneNode[] — see below */ ]
}
```

## Node types

| `type`          | Purpose                                                          |
| ---------------- | ----------------------------------------------------------------- |
| `line`           | A spoken line. `speaker`, `expression`, `text`, optional `characters` (full stage directions), `camera`, `audio`, `transition`. |
| `narration`      | Same shape as `line` but with no `speaker` (or an omitted name box). |
| `choice`         | `prompt` + `options[]`, each with `text`, `goTo`, optional `conditions`/`setFlags`/`setVariables`. |
| `scene-change`   | Jumps to another scene by id (`targetSceneId`).                   |
| `set-flag`       | Sets one or more boolean flags, then continues to `next`.         |
| `set-variable`   | Sets/adds/subtracts numeric or string variables, then `next`.     |
| `conditional`    | Branches to `ifTrue`/`ifFalse` based on `conditions[]`.           |
| `end`            | Terminates the scene; optional `endingId` resolved against `data/endings/`. |

Every node needs a unique `id` (scoped per scene). `StoryEngine` walks this
graph — nothing about story flow is hardcoded in React components.

## No hardcoded dialogue in components

This is the whole point of the JSON-driven design: writers/designers can
add, reorder, or rewrite entire scenes without touching TypeScript.
