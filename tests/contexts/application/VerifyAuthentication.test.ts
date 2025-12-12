import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VerifyAuthentication } from '@/lib/application/use-cases/VerifyAuthentication';
import type { IAuthenticationService } from '@/lib/application/ports/IAuthenticationService';
import type { User } from '@/lib/domain/models/User';

describe('VerifyAuthentication', () => {
  let mockAuthService: IAuthenticationService;
  let useCase: VerifyAuthentication;

  const allowedEmail: string = 'allowed@example.com';

  const mockAllowedUser: User = {
    id: '123',
    email: allowedEmail,
    name: 'Allowed User',
    image: 'https://example.com/avatar.jpg',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  };

  const mockUnauthorizedUser: User = {
    id: '456',
    email: 'unauthorized@example.com',
    name: 'Unauthorized User',
    image: 'https://example.com/avatar2.jpg',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockAuthService = {
      getCurrentUser: vi.fn(),
      getSession: vi.fn(),
      isAuthenticated: vi.fn(),
      isAuthorized: vi.fn(),
      signOut: vi.fn(),
    };

    useCase = new VerifyAuthentication(mockAuthService);
  });

  describe('when user is not authenticated', () => {
    it('should return null', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(false);

      const result = await useCase.execute();

      expect(result).toBeNull();
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledOnce();
      expect(mockAuthService.getCurrentUser).not.toHaveBeenCalled();
      expect(mockAuthService.isAuthorized).not.toHaveBeenCalled();
    });
  });

  describe('when user is authenticated but getCurrentUser returns null', () => {
    it('should return null', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(true);
      vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(null);

      const result = await useCase.execute();

      expect(result).toBeNull();
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledOnce();
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledOnce();
      expect(mockAuthService.isAuthorized).not.toHaveBeenCalled();
    });
  });

  describe('single-user authorization (ALLOWED_EMAIL)', () => {
    it('should return null and sign out when user email does not match ALLOWED_EMAIL', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(true);
      vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(mockUnauthorizedUser);
      vi.mocked(mockAuthService.isAuthorized).mockResolvedValue(false);

      const result = await useCase.execute();

      expect(result).toBeNull();
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledOnce();
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledOnce();
      expect(mockAuthService.isAuthorized).toHaveBeenCalledWith('unauthorized@example.com');
      expect(mockAuthService.signOut).toHaveBeenCalledOnce();
    });

    it('should return user when email matches ALLOWED_EMAIL', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(true);
      vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(mockAllowedUser);
      vi.mocked(mockAuthService.isAuthorized).mockResolvedValue(true);

      const result = await useCase.execute();

      expect(result).toEqual(mockAllowedUser);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledOnce();
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledOnce();
      expect(mockAuthService.isAuthorized).toHaveBeenCalledWith(allowedEmail);
      expect(mockAuthService.signOut).not.toHaveBeenCalled();
    });

    it('should handle case-insensitive email matching', async () => {
      const upperCaseAllowedUser: User = {
        ...mockAllowedUser,
        email: allowedEmail.toUpperCase(),
      };

      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(true);
      vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(upperCaseAllowedUser);
      vi.mocked(mockAuthService.isAuthorized).mockResolvedValue(true);

      const result = await useCase.execute();

      expect(result).toEqual(upperCaseAllowedUser);
      expect(mockAuthService.isAuthorized).toHaveBeenCalledWith(allowedEmail.toUpperCase());
    });
  });

  describe('error handling', () => {
    it('should handle errors from isAuthenticated gracefully', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockRejectedValue(new Error('Auth check failed'));

      await expect(useCase.execute()).rejects.toThrow('Auth check failed');
      expect(mockAuthService.getCurrentUser).not.toHaveBeenCalled();
    });

    it('should handle errors from getCurrentUser gracefully', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(true);
      vi.mocked(mockAuthService.getCurrentUser).mockRejectedValue(new Error('User fetch failed'));

      await expect(useCase.execute()).rejects.toThrow('User fetch failed');
      expect(mockAuthService.isAuthorized).not.toHaveBeenCalled();
    });

    it('should handle errors from isAuthorized gracefully', async () => {
      vi.mocked(mockAuthService.isAuthenticated).mockResolvedValue(true);
      vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(mockAllowedUser);
      vi.mocked(mockAuthService.isAuthorized).mockRejectedValue(new Error('Authorization failed'));

      await expect(useCase.execute()).rejects.toThrow('Authorization failed');
      expect(mockAuthService.signOut).not.toHaveBeenCalled();
    });
  });
});
