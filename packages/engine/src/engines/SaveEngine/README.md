# engine/engines/SaveEngine

Reads/writes save slots to `localStorage` under `STORAGE_KEYS.saves`, enforces the manual-slot cap, and rehydrates `gameStore`/`dialogueStore` from a chosen slot via `applySave`.
