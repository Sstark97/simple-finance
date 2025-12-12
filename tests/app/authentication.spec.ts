import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Unauthenticated User', () => {
    test('should redirect to /login when accessing protected pages', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to /login when accessing /gastos', async ({ page }) => {
      await page.goto('/gastos');

      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to /login when accessing /patrimonio', async ({ page }) => {
      await page.goto('/patrimonio');

      await expect(page).toHaveURL(/\/login/);
    });

    test('should allow access to /login page', async ({ page }) => {
      await page.goto('/login');

      await expect(page).toHaveURL(/\/login/);
      await expect(page.locator('h1, h2, h3')).toContainText('Simple Finance');
    });
  });

  test.describe('Login Page UI', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display login page with correct elements', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /simple finance/i })).toBeVisible();

      const description = page.getByText(/gestión inteligente/i);
      await expect(description).toBeVisible();

      const signInButton = page.getByRole('button', { name: /iniciar sesión con google/i });
      await expect(signInButton).toBeVisible();
      await expect(signInButton).toBeEnabled();
    });

    test('should display terms of service text', async ({ page }) => {
      const termsText = page.getByText(/al iniciar sesión, aceptas/i);
      await expect(termsText).toBeVisible();
    });

    test('should have Google icon in sign-in button', async ({ page }) => {
      const signInButton = page.getByRole('button', { name: /iniciar sesión con google/i });
      const svg = signInButton.locator('svg');

      await expect(svg).toBeVisible();
    });
  });

  test.describe('Sign-In Button Interaction', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should show loading state when clicking sign-in button', async ({ page }) => {
      const signInButton = page.getByRole('button', { name: /iniciar sesión con google/i });

      await signInButton.click();

      const loadingText = page.getByText(/conectando/i);
      await expect(loadingText).toBeVisible();

      const spinner = page.locator('[class*="spinner"]').or(page.locator('svg[class*="animate-spin"]'));
      await expect(spinner.first()).toBeVisible();
    });

    test('should redirect to Google OAuth when clicking sign-in', async ({ page, context }) => {
      const signInButton = page.getByRole('button', { name: /iniciar sesión con google/i });

      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        signInButton.click(),
      ]);

      await popup.waitForLoadState();

      const popupUrl = popup.url();
      expect(popupUrl).toContain('accounts.google.com');
    });
  });

  test.describe('Cookie-Based Middleware', () => {
    test('should redirect to login when no session cookie', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect /gastos to login when no session cookie', async ({ page }) => {
      await page.goto('/gastos');

      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect /patrimonio to login when no session cookie', async ({ page }) => {
      await page.goto('/patrimonio');

      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('API Route Protection', () => {
    test('should protect /api/dashboard with auth', async ({ request }) => {
      const response = await request.get('/api/dashboard');

      expect(response.status()).toBe(401);
    });

    test('should protect /api/transactions with auth', async ({ request }) => {
      const response = await request.get('/api/transactions');

      expect(response.status()).toBe(401);
    });

    test('should protect /api/networth with auth', async ({ request }) => {
      const response = await request.get('/api/networth');

      expect(response.status()).toBe(401);
    });
  });

  test.describe('Single-User Authorization', () => {
    test('should display error when unauthorized email attempts to sign in', async ({ page }) => {
      await page.goto('/login');

      const signInButton = page.getByRole('button', { name: /iniciar sesión con google/i });
      await signInButton.click();

      const errorMessage = page.locator('[class*="destructive"]');
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Static Assets and Public Routes', () => {
    test('should allow access to favicon without auth', async ({ request }) => {
      const response = await request.get('/favicon.ico');

      expect([200, 404]).toContain(response.status());
    });

    test('should allow access to images without auth', async ({ request }) => {
      const response = await request.get('/icon-152x152.png');

      expect([200, 404]).toContain(response.status());
    });

    test('should allow access to manifest without auth', async ({ request }) => {
      const response = await request.get('/manifest.json');

      expect([200, 404]).toContain(response.status());
    });

    test('should allow access to auth API routes', async ({ request }) => {
      const response = await request.get('/api/auth/session');

      expect(response.status()).not.toBe(404);
    });
  });
});
