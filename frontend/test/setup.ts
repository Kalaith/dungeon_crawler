import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

if (typeof window !== 'undefined') {
  window.alert = vi.fn();
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
