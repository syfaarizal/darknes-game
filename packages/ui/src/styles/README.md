# ui/styles

`tokens.css` is the single source of truth for the DARKNES color palette,
typography, motion easing, and radii — imported once at the app root
(`apps/game/src/main.tsx`). Never hardcode a hex color or font name in a
component; reference the CSS variable instead so re-skinning a second game
is a one-file change.
