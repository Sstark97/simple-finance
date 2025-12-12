import type { IAuthenticationService } from '@/lib/application/ports/IAuthenticationService';
import type { User, Session } from '@/lib/domain/models/User';
import { getAuthInstance } from '../auth/better-auth.config';
import { headers } from 'next/headers';

export class BetterAuthAdapter implements IAuthenticationService {
  async getCurrentUser(): Promise<User | null> {
    try {
      const auth = getAuthInstance();
      const headersList = await headers();
      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (!session?.user) {
        return null;
      }

      return this.mapBetterAuthUserToDomain(session.user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const auth = getAuthInstance();
      const headersList = await headers();
      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (!session) {
        return null;
      }

      return {
        userId: session.user.id,
        expiresAt: new Date(session.session.expiresAt),
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const auth = getAuthInstance();
      const headersList = await headers();
      const session = await auth.api.getSession({
        headers: headersList,
      });

      return session !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async isAuthorized(email: string): Promise<boolean> {
    const allowedEmail = process.env.ALLOWED_EMAIL;

    // If no allowed email is set, all authenticated users are authorized
    if (!allowedEmail) {
      return true;
    }

    return email.toLowerCase() === allowedEmail.toLowerCase();
  }

  async signOut(): Promise<void> {
    try {
      const auth = getAuthInstance();
      const headersList = await headers();
      await auth.api.signOut({
        headers: headersList,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  private mapBetterAuthUserToDomain(betterAuthUser: Record<string, unknown>): User {
    let createdAt: Date;
    const rawCreatedAt = betterAuthUser.createdAt;

    if (rawCreatedAt instanceof Date) {
      createdAt = rawCreatedAt;
    } else if (typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number') {
      createdAt = new Date(rawCreatedAt);
    } else {
      createdAt = new Date();
    }

    return {
      id: String(betterAuthUser.id),
      email: String(betterAuthUser.email),
      name: betterAuthUser.name ? String(betterAuthUser.name) : undefined,
      image: betterAuthUser.image ? String(betterAuthUser.image) : undefined,
      emailVerified: betterAuthUser.emailVerified ? Boolean(betterAuthUser.emailVerified) : false,
      createdAt,
    };
  }
}
