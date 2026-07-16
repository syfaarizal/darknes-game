/**
 * EXTENSION POINT (partially implemented).
 *
 * Keyboard bindings are simple enough to ship now; gamepad/controller
 * support is the deferred part (see project brief: "Controller Support").
 */

export type InputAction = 'advance' | 'back' | 'skip' | 'toggle-auto' | 'open-menu' | 'open-log';

const DEFAULT_KEY_BINDINGS: Record<string, InputAction> = {
  Enter: 'advance',
  Space: 'advance',
  Escape: 'open-menu',
  Backspace: 'back',
  KeyS: 'skip',
  KeyA: 'toggle-auto',
  KeyL: 'open-log',
};

export function resolveKeyAction(code: string): InputAction | undefined {
  return DEFAULT_KEY_BINDINGS[code];
}

/** Gamepad polling — not implemented yet. Reserved shape for future work. */
export interface GamepadEngineApi {
  isConnected: () => boolean;
  pollActions: () => InputAction[];
}

export const gamepadEngine: GamepadEngineApi = {
  isConnected: () => false,
  pollActions: () => [],
};
