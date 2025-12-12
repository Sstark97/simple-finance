import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  return NextResponse.json(
    {
      pwaEnabled: true,
      version: process.env.npm_package_version ?? '1.0.0',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    }
  );
}
