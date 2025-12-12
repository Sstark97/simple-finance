import '@testing-library/jest-dom/vitest';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/utils/authGuard', () => ({
  requireAuth: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/lib/infrastructure/auth/better-auth.config', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: true,
          createdAt: new Date('2024-01-01'),
        },
        session: {
          id: 'test-session-id',
          userId: 'test-user-id',
          expiresAt: new Date('2025-12-31'),
        },
      }),
      signOut: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

afterEach(() => {
  cleanup();
});

expect.extend({});
