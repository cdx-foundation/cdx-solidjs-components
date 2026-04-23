/**
 * Generates a unique, stable ID suitable for HTML element pairing (label/input).
 * Centralized to avoid duplicated random ID logic across UI components.
 */
export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
