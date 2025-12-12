import { auth as authInstance } from '@/lib/infrastructure/auth/auth';

export function getAuthInstance(): typeof authInstance {
  return authInstance;
}

export const auth = authInstance;

export type BetterAuthSession = typeof authInstance.$Infer.Session.session;
export type BetterAuthUser = typeof authInstance.$Infer.Session.user;
