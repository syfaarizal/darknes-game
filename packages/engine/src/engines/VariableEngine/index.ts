import type { VariableValue } from '@darknes/shared';

export interface VariableContext {
  playerName: string;
  variables: Record<string, VariableValue>;
}

/**
 * The canonical Variable Engine — a single, reusable function that replaces
 * all variable placeholders in any string with their current values.
 *
 * Supported placeholders:
 *   {playerName} or {PLAYER} — the player's chosen name from Identity Setup
 *   {variableKey}           — any variable in gameStore.variables
 *                             e.g. {money}, {chapter}, {damianTrust},
 *                             {mentalState}, {date}, {time}, etc.
 *
 * Usage:
 *   const resolved = replaceVariables("Hello, {playerName}!", context);
 *
 * This function is the single source of truth — every UI component that
 * renders dynamic text should call this function. No duplication.
 *
 * Adding new variables: set them via set-variable nodes in scene JSON.
 * They become available immediately — no engine changes needed.
 */
export function replaceVariables(text: string, ctx: VariableContext): string {
  if (!text) return text;

  let result = text;

  // Always resolve player name placeholders first
  result = result.replace(/\{playerName\}/gi, ctx.playerName);
  result = result.replace(/\{PLAYER\}/g, ctx.playerName);

  // Resolve any game variable placeholders
  for (const [key, value] of Object.entries(ctx.variables)) {
    const pattern = new RegExp(`\\{${key}\\}`, 'gi');
    result = result.replace(pattern, String(value));
  }

  return result;
}

/**
 * Resolves the speaker name field of a dialogue node.
 * Handles cases like {playerName} or PLAYER in the speaker field.
 */
export function resolveSpeakerName(rawSpeaker: string | undefined, ctx: VariableContext): string {
  if (!rawSpeaker) return '';

  // First resolve variables in the speaker name itself
  const resolved = replaceVariables(rawSpeaker, ctx);

  // Then handle the PLAYER fallback label
  if (resolved.toUpperCase() === 'PLAYER') {
    return ctx.playerName || 'PLAYER';
  }

  return resolved;
}

/**
 * Returns a complete VariableContext from the game store state.
 * Call this inside React components or engine functions that need context.
 */
export function getVariableContext(
  playerName: string,
  variables: Record<string, VariableValue>,
): VariableContext {
  return { playerName, variables };
}
