'use client';

import { usePWA } from '@/hooks/usePWA';

export function PWAProvider(): null {
  usePWA();
  return null;
}
