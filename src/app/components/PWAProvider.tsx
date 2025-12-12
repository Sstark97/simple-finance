'use client';

import { usePWA } from '@/lib/hooks/usePWA';

export function PWAProvider(): null {
  usePWA();
  return null;
}
