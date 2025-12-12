export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface Session {
  userId: string;
  expiresAt: Date;
}
