import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BetterAuthAdapter } from '@/lib/infrastructure/adapters/BetterAuthAdapter';
import type { User } from '@/lib/domain/models/User';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('@/lib/infrastructure/auth/better-auth.config', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('BetterAuthAdapter', () => {
  let adapter: BetterAuthAdapter;
  let mockHeaders: ReturnType<typeof vi.fn>;
  let mockAuth: {
    api: {
      getSession: ReturnType<typeof vi.fn>;
      signOut: ReturnType<typeof vi.fn>;
    };
  };

  const mockBetterAuthUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  };

  const mockBetterAuthSession = {
    user: mockBetterAuthUser,
    session: {
      id: 'session-123',
      userId: '123',
      expiresAt: new Date('2024-12-31'),
    },
  };

  beforeEach(async () => {
    const { headers } = await import('next/headers');
    const authModule = await import('@/lib/infrastructure/auth/better-auth.config');

    mockHeaders = vi.mocked(headers);
    mockAuth = authModule.auth as unknown as typeof mockAuth;

    mockHeaders.mockResolvedValue(new Headers());

    adapter = new BetterAuthAdapter();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user when session exists', async () => {
      mockAuth.api.getSession.mockResolvedValue(mockBetterAuthSession);

      const result = await adapter.getCurrentUser();

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
        emailVerified: true,
        createdAt: new Date('2024-01-01'),
      } satisfies User);

      expect(mockAuth.api.getSession).toHaveBeenCalledOnce();
    });

    it('should return null when session is null', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);

      const result = await adapter.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when session has no user', async () => {
      mockAuth.api.getSession.mockResolvedValue({ session: {}, user: null });

      const result = await adapter.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuth.api.getSession.mockRejectedValue(new Error('Session error'));

      const result = await adapter.getCurrentUser();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting current user:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should map optional fields correctly when missing', async () => {
      const minimalUser = {
        id: '123',
        email: 'test@example.com',
        emailVerified: false,
        createdAt: new Date('2024-01-01'),
      };

      mockAuth.api.getSession.mockResolvedValue({
        user: minimalUser,
        session: { expiresAt: new Date() },
      });

      const result = await adapter.getCurrentUser();

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        name: undefined,
        image: undefined,
        emailVerified: false,
        createdAt: new Date('2024-01-01'),
      });
    });

    it('should handle createdAt as string', async () => {
      const userWithStringDate = {
        ...mockBetterAuthUser,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      mockAuth.api.getSession.mockResolvedValue({
        user: userWithStringDate,
        session: { expiresAt: new Date() },
      });

      const result = await adapter.getCurrentUser();

      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should handle createdAt as timestamp', async () => {
      const userWithTimestamp = {
        ...mockBetterAuthUser,
        createdAt: 1704067200000,
      };

      mockAuth.api.getSession.mockResolvedValue({
        user: userWithTimestamp,
        session: { expiresAt: new Date() },
      });

      const result = await adapter.getCurrentUser();

      expect(result?.createdAt).toBeInstanceOf(Date);
    });

    it('should use current date when createdAt is invalid', async () => {
      const userWithInvalidDate = {
        ...mockBetterAuthUser,
        createdAt: null,
      };

      mockAuth.api.getSession.mockResolvedValue({
        user: userWithInvalidDate,
        session: { expiresAt: new Date() },
      });

      const result = await adapter.getCurrentUser();

      expect(result?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getSession', () => {
    it('should return session when it exists', async () => {
      mockAuth.api.getSession.mockResolvedValue(mockBetterAuthSession);

      const result = await adapter.getSession();

      expect(result).toEqual({
        userId: '123',
        expiresAt: new Date('2024-12-31'),
      });
    });

    it('should return null when session is null', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);

      const result = await adapter.getSession();

      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuth.api.getSession.mockRejectedValue(new Error('Session error'));

      const result = await adapter.getSession();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting session:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when session exists', async () => {
      mockAuth.api.getSession.mockResolvedValue(mockBetterAuthSession);

      const result = await adapter.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when session is null', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);

      const result = await adapter.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuth.api.getSession.mockRejectedValue(new Error('Auth error'));

      const result = await adapter.isAuthenticated();

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error checking authentication:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('isAuthorized', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return true when email matches ALLOWED_EMAIL (case-insensitive)', async () => {
      process.env.ALLOWED_EMAIL = 'allowed@example.com';

      const result = await adapter.isAuthorized('allowed@example.com');

      expect(result).toBe(true);
    });

    it('should return true when email matches ALLOWED_EMAIL with different case', async () => {
      process.env.ALLOWED_EMAIL = 'allowed@example.com';

      const result = await adapter.isAuthorized('ALLOWED@EXAMPLE.COM');

      expect(result).toBe(true);
    });

    it('should return false when email does not match ALLOWED_EMAIL', async () => {
      process.env.ALLOWED_EMAIL = 'allowed@example.com';

      const result = await adapter.isAuthorized('notallowed@example.com');

      expect(result).toBe(false);
    });

    it('should return true when no ALLOWED_EMAIL is set', async () => {
      delete process.env.ALLOWED_EMAIL;

      const result = await adapter.isAuthorized('any@example.com');

      expect(result).toBe(true);
    });

    it('should return true when ALLOWED_EMAIL is empty string', async () => {
      process.env.ALLOWED_EMAIL = '';

      const result = await adapter.isAuthorized('any@example.com');

      expect(result).toBe(true);
    });
  });

  describe('signOut', () => {
    it('should call auth.api.signOut', async () => {
      mockAuth.api.signOut.mockResolvedValue(undefined);

      await adapter.signOut();

      expect(mockAuth.api.signOut).toHaveBeenCalledOnce();
      expect(mockAuth.api.signOut).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      });
    });

    it('should handle sign-out errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuth.api.signOut.mockRejectedValue(new Error('Sign out failed'));

      await adapter.signOut();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});
