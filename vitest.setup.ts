import '@testing-library/jest-dom';
import { clickOutside } from './lib/directives';

// Register directives for testing
// @ts-ignore
window.clickOutside = clickOutside;
