import type { AuthenticationRepository } from '../repositories/AuthenticationRepository';
import type { User } from '@/lib/domain/models/User';

export class VerifyAuthentication {
  constructor(private authService: AuthenticationRepository) {}

  async execute(): Promise<User | null> {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      return null;
    }

    const user = await this.authService.getCurrentUser();
    if (!user) {
      return null;
    }

    const isAuthorized = await this.authService.isAuthorized(user.email);
    if (!isAuthorized) {
      await this.authService.signOut();
      return null;
    }

    return user;
  }
}
