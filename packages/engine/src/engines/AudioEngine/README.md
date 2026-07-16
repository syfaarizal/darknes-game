# engine/engines/AudioEngine

Howler.js wrapper with one pool per audio id, volume mixing driven by `settingsStore`, and crossfade support via `playCue`/`stopCue`, organized by `AudioChannel` (music/sfx/voice/ambience/ui).
