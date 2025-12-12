import { NextResponse } from 'next/server';
import { BetterAuthAdapter } from '@/lib/infrastructure/adapters/BetterAuthAdapter';
import { VerifyAuthentication } from '@/lib/application/use-cases/VerifyAuthentication';

export async function requireAuth(): Promise<NextResponse | null> {
  const authAdapter = new BetterAuthAdapter();
  const verifyAuthUseCase = new VerifyAuthentication(authAdapter);

  try {
    const user = await verifyAuthUseCase.execute();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized', error: 'You must be authenticated and authorized to access this resource' },
        { status: 401 }
      );
    }

    return null;
  } catch (error) {
    console.error('Authentication error in API route:', error);
    return NextResponse.json(
      { message: 'Authentication failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 401 }
    );
  }
}
