import type { ConditionExpression, FlagValue, VariableValue } from '../types';

/** Generates a short, collision-resistant id without extra dependencies. */
export function generateId(prefix = 'id'): string {
  const random = Math.random().toString(36).slice(2, 9);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${random}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Evaluates a single condition against the current flags/variables maps. */
export function evaluateCondition(
  condition: ConditionExpression,
  flags: Record<string, FlagValue>,
  variables: Record<string, VariableValue>,
): boolean {
  const current = condition.kind === 'flag' ? flags[condition.key] : variables[condition.key];

  switch (condition.operator) {
    case '==':
      return current === condition.value;
    case '!=':
      return current !== condition.value;
    case '>':
      return Number(current) > Number(condition.value);
    case '<':
      return Number(current) < Number(condition.value);
    case '>=':
      return Number(current) >= Number(condition.value);
    case '<=':
      return Number(current) <= Number(condition.value);
    default:
      return false;
  }
}

export function evaluateConditions(
  conditions: ConditionExpression[] | undefined,
  flags: Record<string, FlagValue>,
  variables: Record<string, VariableValue>,
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((c) => evaluateCondition(c, flags, variables));
}

/** Simple linear interpolation, used by the camera/animation engines. */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}
