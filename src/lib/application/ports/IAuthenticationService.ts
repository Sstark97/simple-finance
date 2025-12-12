import type { User, Session } from '@/lib/domain/models/User';

export interface IAuthenticationService {
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<Session | null>;
  isAuthenticated(): Promise<boolean>;
  isAuthorized(email: string): Promise<boolean>;
  signOut(): Promise<void>;
}
