# Better Auth Usage Examples

Quick reference for using authentication in Simple Finance.

## Client-Side: React Components

### Basic Sign In/Out Button

```typescript
"use client";

import { useSession, signIn, signOut } from "@/lib/infrastructure/auth/client";

export function AuthButton(): JSX.Element {
  const session = useSession();

  if (session.isPending) return <div>Loading...</div>;

  if (!session.data) {
    return (
      <button onClick={() => signIn.social({ provider: "google" })}>
        Sign in with Google
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {session.data.user.name}</p>
      <p>Email: {session.data.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

### Conditional Rendering Based on Auth

```typescript
"use client";

import { useSession } from "@/lib/infrastructure/auth/client";

export function ProtectedContent(): JSX.Element {
  const session = useSession();

  if (!session.data) {
    return <div>Please sign in to view this content</div>;
  }

  return (
    <div>
      <h1>Your Dashboard</h1>
      <p>Authenticated as: {session.data.user.email}</p>
    </div>
  );
}
```

### Using Session Data

```typescript
"use client";

import { useSession } from "@/lib/infrastructure/auth/client";

export function UserProfile(): JSX.Element {
  const session = useSession();

  const user = session.data?.user;
  const sessionToken = session.data?.session.token;

  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <img src={user.image ?? undefined} alt={user.name ?? undefined} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## Server-Side: API Routes

### Protected API Route

```typescript
import { auth } from "@/lib/infrastructure/auth/better-auth.config";

export async function GET(request: Request): Promise<Response> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  return Response.json({
    message: `Hello ${session.user.email}`,
    userId: session.user.id,
  });
}
```

### Server Action with Auth Check

```typescript
"use server";

import { auth } from "@/lib/infrastructure/auth/better-auth.config";
import { headers } from "next/headers";

export async function getAuthenticatedUser(): Promise<
  | { id: string; email: string; name: string | null }
  | null
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
```

## Layout Integration

### App Layout with Auth Provider

```typescript
import type { ReactNode } from "react";
import { AuthButton } from "@/app/components/auth-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <h1>Simple Finance</h1>
            <AuthButton />
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

## Middleware Protection

### Route Protection Middleware

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/infrastructure/auth/better-auth.config";

const protectedRoutes = ["/dashboard", "/transactions", "/patrimonio"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
```

## TypeScript Types

```typescript
import { type Session, type User } from "@/lib/infrastructure/auth/better-auth.config";

function processUserSession(session: Session): void {
  const user: User = session.user;
  console.log(`User: ${user.email}`);
}
```

## Common Patterns

### Check Auth in useEffect

```typescript
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/infrastructure/auth/client";

export function MyComponent(): JSX.Element {
  const session = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!session.isPending) {
      setIsReady(true);
    }
  }, [session.isPending]);

  if (!isReady) return <div>Loading...</div>;

  if (!session.data) {
    return <div>Please sign in</div>;
  }

  return <div>Authenticated content</div>;
}
```

### Redirect Unauthenticated Users

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/infrastructure/auth/client";

export function RequireAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.push("/");
    }
  }, [session.isPending, session.data, router]);

  if (session.isPending || !session.data) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
```

## Handling Sign-In Errors

```typescript
"use client";

import { useState } from "react";
import { signIn } from "@/lib/infrastructure/auth/client";

export function SignInForm(): JSX.Element {
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(): Promise<void> {
    try {
      setError(null);
      await signIn.social({ provider: "google" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign in failed"
      );
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
}
```

## Session Update on Sign-Out

```typescript
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/infrastructure/auth/client";

export function SignOutButton(): JSX.Element {
  const router = useRouter();

  async function handleSignOut(): Promise<void> {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

## Environment-Specific Configuration

```typescript
const isProduction = process.env.NODE_ENV === "production";
const authUrl = isProduction
  ? "https://your-domain.com"
  : "http://localhost:3000";
```

## Debugging

### Log Current Session

```typescript
"use client";

import { useSession } from "@/lib/infrastructure/auth/client";

export function DebugSession(): JSX.Element {
  const session = useSession();

  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
```

## API Response Types

```typescript
interface AuthResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function callProtectedApi(): Promise<AuthResponse<unknown>> {
  const response = await fetch("/api/protected", {
    credentials: "include",
  });

  if (!response.ok) {
    return { success: false, error: "API request failed" };
  }

  const data = await response.json();
  return { success: true, data };
}
```
