# Better Auth Setup Guide

## Installation Status

Better Auth has been successfully installed and configured for the Simple Finance project.

### Installed Dependencies
- `better-auth`: v1.4.6 (Authentication framework)
- `better-sqlite3`: v12.5.0 (SQLite database driver)

## Configuration Files Created

1. **Server Configuration**: `/src/lib/infrastructure/auth/better-auth.config.ts`
   - SQLite database setup at `{project-root}/auth.db`
   - Google OAuth provider configuration
   - Single-user authorization via `ALLOWED_EMAIL`
   - Session management callbacks

2. **API Route Handler**: `/src/app/api/auth/[...auth]/route.ts`
   - Handles all authentication requests at `/api/auth/*`
   - Routes: `/api/auth/sign-in`, `/api/auth/sign-out`, etc.

3. **Frontend Client**: `/src/lib/infrastructure/auth/client.ts`
   - React hooks: `useSession`, `useListSessions`
   - Functions: `signIn`, `signOut`
   - Atom: `sessionAtom` for state management

## Environment Variables

Add to `.env.local` (created at project root):

```
BETTER_AUTH_SECRET=your-secret-key-min-32-characters
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

ALLOWED_EMAIL=your-email@example.com
```

## Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Select "Web Application"
6. Add authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

## Generating BETTER_AUTH_SECRET

Generate a secure 32+ character secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database

- Type: SQLite (file-based, no external database required)
- Location: `{project-root}/auth.db` (auto-created on first run)
- Tables: Auto-migrated on startup

## Single-User Authorization

The `ALLOWED_EMAIL` environment variable ensures only one email can access the application:

- If user tries to sign in with different email, they get an authorization error
- This is enforced in the `onSuccess` callback in the auth config
- Set to your email address for deployment

## Usage in Components

### Server-Side (API Routes)

```typescript
import { auth } from "@/lib/infrastructure/auth/better-auth.config";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json(session);
}
```

### Client-Side (React Components)

```typescript
"use client";

import { useSession, signIn, signOut } from "@/lib/infrastructure/auth/client";

export function AuthButton() {
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
      <p>Signed in as {session.data.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

## Key Features

- **OAuth 2.0**: Secure Google authentication with refresh tokens
- **Session Management**: Automatic session handling and expiration
- **Database**: SQLite for persistent storage (no external DB needed)
- **Single-User Authorization**: Email-based access control
- **TypeScript**: Full type safety with exported types

## Important Notes

1. The `auth.db` file will be created in the project root on first authentication
2. Google OAuth requires offline access enabled for refresh tokens
3. The `prompt: "select_account"` ensures users can switch Google accounts
4. The configuration uses callbacks for custom authorization logic
5. Email verification is logged to console (implement actual email sending if needed)

## Security Considerations

1. Never commit `.env.local` to version control
2. Use strong `BETTER_AUTH_SECRET` (minimum 32 characters)
3. HTTPS is required in production
4. Keep Google OAuth credentials secure
5. Regularly rotate refresh tokens
6. Monitor authentication logs for unauthorized attempts

## Testing Locally

1. Set `ALLOWED_EMAIL` to your test email
2. Generate a `BETTER_AUTH_SECRET` and add to `.env.local`
3. Add Google OAuth credentials to `.env.local`
4. Run `pnpm dev`
5. Navigate to your app and test the Google sign-in button

## Troubleshooting

**"Unauthorized" error on sign-in**
- Verify email matches `ALLOWED_EMAIL` (case-insensitive)
- Check `.env.local` is loaded correctly

**Database file not created**
- Ensure write permissions in project root
- Check console for database connection errors

**Google OAuth not working**
- Verify credentials in Google Cloud Console
- Check redirect URI matches exactly (http vs https, trailing slash)
- Ensure Google+ API is enabled

**Session not persisting**
- Verify `auth.db` exists in project root
- Check browser cookies are enabled
- Clear cookies and try again

## Architecture Notes

- Better Auth handles session persistence automatically
- SQLite database is lightweight and suitable for single-user apps
- The single-user authorization layer prevents multi-user access
- Session tokens are stored in secure HTTP-only cookies
- API routes use the auth instance to validate sessions

## Next Steps

1. Configure Google OAuth credentials in Google Cloud Console
2. Generate and add `BETTER_AUTH_SECRET` to `.env.local`
3. Set `ALLOWED_EMAIL` to your email
4. Test authentication flow
5. Integrate auth checks in protected routes/components
