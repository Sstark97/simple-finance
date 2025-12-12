# Authentication Architecture

## Overview

This document describes the authentication architecture for Simple Finance, designed following hexagonal architecture (ports and adapters) principles to ensure provider independence and testability.

## Architecture Principles

### Hexagonal Architecture (Ports and Adapters)

The authentication system follows a clean separation of concerns:

- **Domain Layer**: Provider-agnostic models (`User`, `Session`)
- **Application Layer**: Business logic and port interfaces (`IAuthenticationService`, use cases)
- **Infrastructure Layer**: Provider-specific implementations (adapters)

### Why Ports and Adapters for Authentication?

1. **Provider Independence**: Swap authentication providers without changing business logic
2. **Testability**: Mock authentication easily in tests
3. **Single Responsibility**: Each layer has clear responsibilities
4. **Maintainability**: Changes in auth provider don't ripple through the codebase
5. **Flexibility**: Support multiple auth strategies simultaneously if needed

## Folder Structure

```
src/lib/
├── domain/
│   └── models/
│       └── User.ts                    # User and Session domain models
├── application/
│   ├── ports/
│   │   └── IAuthenticationService.ts  # Authentication port interface
│   └── use-cases/
│       └── VerifyAuthentication.ts    # Authentication business logic
└── infrastructure/
    └── adapters/
        ├── BetterAuthAdapter.ts       # Better Auth implementation
        ├── ClerkAdapter.ts            # Clerk implementation (example)
        └── NextAuthAdapter.ts         # NextAuth implementation (example)
```

## Core Components

### 1. Domain Models (`/src/lib/domain/models/User.ts`)

```typescript
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
```

These models represent the essential authentication data, independent of any provider.

### 2. Authentication Port (`/src/lib/application/ports/IAuthenticationService.ts`)

```typescript
export interface IAuthenticationService {
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<Session | null>;
  isAuthenticated(): Promise<boolean>;
  isAuthorized(email: string): Promise<boolean>;
  signOut(): Promise<void>;
}
```

This interface defines the contract that any authentication provider must implement.

### 3. Use Cases (`/src/lib/application/use-cases/VerifyAuthentication.ts`)

Business logic stays in use cases. Example: `VerifyAuthentication` checks authentication status and enforces single-user authorization.

## How to Swap Providers

### Step 1: Implement the IAuthenticationService Interface

Create a new adapter in `/src/lib/infrastructure/adapters/`:

```typescript
// Example: ClerkAdapter.ts
import { currentUser } from '@clerk/nextjs/server';
import type { IAuthenticationService } from '@/lib/application/ports/IAuthenticationService';
import type { User } from '@/lib/domain/models/User';

export class ClerkAuthenticationAdapter implements IAuthenticationService {
  async getCurrentUser(): Promise<User | null> {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: clerkUser.fullName ?? undefined,
      image: clerkUser.imageUrl ?? undefined,
      emailVerified: clerkUser.emailAddresses[0]?.verification.status === 'verified',
      createdAt: new Date(clerkUser.createdAt),
    };
  }

  async getSession(): Promise<Session | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    return {
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  async isAuthorized(email: string): Promise<boolean> {
    const allowedEmail = process.env.ALLOWED_EMAIL;
    return email === allowedEmail;
  }

  async signOut(): Promise<void> {
    // Clerk's sign-out logic
  }
}
```

### Step 2: Update Dependency Injection

Change the adapter used in your application:

```typescript
// Before (Better Auth)
import { BetterAuthAdapter } from '@/lib/infrastructure/adapters/BetterAuthAdapter';
const authService = new BetterAuthAdapter();

// After (Clerk)
import { ClerkAuthenticationAdapter } from '@/lib/infrastructure/adapters/ClerkAuthAdapter';
const authService = new ClerkAuthenticationAdapter();
```

### Step 3: No Changes Needed Elsewhere

Your use cases, API routes, and components continue to work without modification because they depend on `IAuthenticationService`, not the concrete implementation.

## Example: Swapping from Better Auth to NextAuth

### Before: Better Auth Adapter

```typescript
import { auth } from '@/lib/auth';
import type { IAuthenticationService } from '@/lib/application/ports/IAuthenticationService';

export class BetterAuthAdapter implements IAuthenticationService {
  async getCurrentUser(): Promise<User | null> {
    const session = await auth.api.getSession({ headers: await headers() });
    // Better Auth specific logic
  }
}
```

### After: NextAuth Adapter

```typescript
import { auth } from '@/auth';
import type { IAuthenticationService } from '@/lib/application/ports/IAuthenticationService';

export class NextAuthAdapter implements IAuthenticationService {
  async getCurrentUser(): Promise<User | null> {
    const session = await auth();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email ?? '',
      name: session.user.name ?? undefined,
      image: session.user.image ?? undefined,
      emailVerified: session.user.emailVerified ?? false,
      createdAt: new Date(session.user.createdAt ?? Date.now()),
    };
  }

  // ... implement other methods
}
```

Only the adapter changes. Use cases, business logic, and frontend components remain unchanged.

## Testing Strategy

### Unit Testing Use Cases

```typescript
import { VerifyAuthentication } from '@/lib/application/use-cases/VerifyAuthentication';
import type { IAuthenticationService } from '@/lib/application/ports/IAuthenticationService';

describe('VerifyAuthentication', () => {
  it('should return null for unauthorized user', async () => {
    const mockAuthService: IAuthenticationService = {
      getCurrentUser: jest.fn().mockResolvedValue({ email: 'wrong@example.com' }),
      isAuthenticated: jest.fn().mockResolvedValue(true),
      isAuthorized: jest.fn().mockResolvedValue(false),
      signOut: jest.fn(),
      getSession: jest.fn(),
    };

    const useCase = new VerifyAuthentication(mockAuthService);
    const result = await useCase.execute();

    expect(result).toBeNull();
    expect(mockAuthService.signOut).toHaveBeenCalled();
  });
});
```

### Integration Testing Adapters

Test each adapter independently to ensure it correctly implements the interface.

## Benefits

1. **Easy Migration**: Switch providers by implementing one interface
2. **No Vendor Lock-in**: Not tied to any specific auth library
3. **Testable**: Mock authentication in tests without complex setup
4. **Clear Boundaries**: Business logic separated from infrastructure
5. **Single Source of Truth**: Domain models define what "User" means
6. **Maintainable**: Changes isolated to specific layers

## Single-User Authorization

The `isAuthorized()` method enforces single-user access by comparing the user's email against `ALLOWED_EMAIL` environment variable. This business rule lives in the application layer, not in provider-specific code.

## Future Enhancements

- Add `refreshSession()` method to the port
- Support multiple authorization strategies (roles, permissions)
- Add password change/reset methods if using password-based auth
- Support OAuth providers through the same interface
