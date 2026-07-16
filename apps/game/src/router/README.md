# router

Single `createHashRouter` instance mapping the game flow from the brief
(Splash → Main Menu → Game → …) to routes. Hash routing is deliberate: this
is a desktop-first SPA that may be hosted statically or opened without a
configured server, so there's no reliance on server-side rewrites for deep
links like `/game` or `/ending` to work.
