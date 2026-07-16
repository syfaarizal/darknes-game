# hooks

App-specific React hooks (as opposed to the reusable, engine-level hooks in
`@darknes/engine/hooks`). Empty for now — add hooks here when a screen
needs local UI state that doesn't belong in a Zustand store (e.g. a
`useKeyboardShortcuts` hook wiring `InputEngine.resolveKeyAction` to
`StoryEngine` calls for this specific app's key bindings).
