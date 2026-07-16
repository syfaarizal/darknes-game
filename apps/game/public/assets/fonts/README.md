# assets/fonts

Self-hosted font files (Cinzel, Inter) for production. Dev currently loads both from Google Fonts via `src/styles/index.css` — swap that `@import` for local `@font-face` rules pointing here before shipping, for offline support and to drop the external request.
