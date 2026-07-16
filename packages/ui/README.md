# @darknes/ui

Presentational component library for the DARKNES visual novel look — dark,
luxury, glass panels, thin red-accented borders, Cinzel display type over
Inter body type. Components here read state from `@darknes/engine`'s hooks
but contain no gameplay logic of their own: given the same store state, two
different games could restyle this whole package and get a different game
without touching `engine`.

## Structure

Every folder under `components/` is one piece of the in-game HUD, matching
the reference mockup 1:1:

- `Background` — the full-bleed scene background image/layer.
- `Character` — a positioned character portrait with speaking highlight.
- `Camera` — wraps the stage (background + characters) and applies
  `CameraEngine` zoom/pan/shake targets via Framer Motion.
- `SceneTransition` — `AnimatePresence` wrapper driven by `AnimationEngine`.
- `ScreenFade` — full-screen fade/flash overlay, used for hard cuts.
- `Typewriter` — generic revealed-text span, built on `useTypewriter`.
- `DialogueBox` / `NameBox` — the glass dialogue panel + speaker name tag.
- `ChoiceBox` — the branching-choice button list.
- `TopBar` — log / settings / menu icon cluster (top-right in the mockup).
- `BottomBar` — auto / skip / quick-save control strip.
- `History` — scrollback modal of everything said so far.
- `Notification` — small toast (e.g. "Saved", "Auto Mode On").
- `Menu` — the main-menu button stack (New Game / Continue / Settings / …).
- `Buttons` — shared `PrimaryButton`, `SecondaryButton`, `GhostButton`,
  `IconButton` primitives every other component is built from.
- `Settings` — the volume/text-speed/fullscreen settings panel.

## Styling approach

Tailwind utility classes throughout, driven by CSS variables defined in
`styles/tokens.css` (see that file for the full palette). No component
hardcodes a hex color — always `var(--color-*)` / the matching Tailwind
token, so a second game can re-skin the whole UI by swapping one CSS file.
