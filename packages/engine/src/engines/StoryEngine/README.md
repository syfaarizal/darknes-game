# engine/engines/StoryEngine

Top-level orchestrator. Walks the scene node graph (line -> choice -> conditional -> scene-change -> end), calling into every other engine along the way. This is the only engine module UI components should call directly for gameplay flow (`startScene`, `advance`, `choose`).
