# @darknes/shared

Framework-agnostic types, enums, constants, and pure utility functions shared
across the whole monorepo (`engine`, `ui`, `assets`, and every `app`).

**Rule of thumb:** if a piece of code has zero React, zero Zustand, and zero
DOM dependency, and more than one package needs it, it belongs here.

## Contents

- `types/` — TypeScript interfaces for scenes, characters, dialogue lines,
  choices, flags, variables, save files, and settings.
- `enums/` — String enums for transitions, camera moves, character
  expressions, audio channels, etc.
- `constants/` — Numeric/string constants (default typewriter speed, save
  slot count, storage keys, animation durations).
- `utils/` — Pure helper functions (id generation, deep clone, clamp,
  interpolation, JSON schema guards).

## Why this package exists

DARKNES is built as a **reusable Visual Novel engine**, not a one-off game.
Types living in `shared` (instead of inside `engine` or the `game` app) mean
a future second game, or the `ui` package's Storybook, can depend on the same
contracts without depending on engine runtime code.
