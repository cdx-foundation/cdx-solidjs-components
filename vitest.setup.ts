import '@testing-library/jest-dom';
import { clickOutside } from './lib/directives';

// Register directives for testing
// @ts-ignore
window.clickOutside = clickOutside;

// Polyfill matchMedia for jsdom (required by @solid-primitives/media)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
