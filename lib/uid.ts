import { createUniqueId } from 'solid-js';

/**
 * Generates a unique, stable ID suitable for HTML element pairing (label/input).
 * Centralized to avoid duplicated random ID logic across UI components.
 * Uses SolidJS's createUniqueId for SSR safety.
 */
export function uid(prefix: string): string {
  return `${prefix}-${createUniqueId()}`;
}
