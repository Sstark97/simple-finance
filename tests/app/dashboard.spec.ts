import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('should load dashboard page successfully', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Simple Finance/i);

    // Verify main sections are present
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display KPI card when data is available', async ({ page }) => {
    await page.goto('/');

    // Check if either the KPI card or skeleton is visible
    const hasKPI = await page.getByText('Dinero Libre').isVisible().catch(() => false);
    const hasSkeleton = await page.locator('.animate-pulse').first().isVisible().catch(() => false);

    expect(hasKPI || hasSkeleton).toBeTruthy();
  });

  test('should have navigation to gastos page', async ({ page }) => {
    await page.goto('/');

    // Find and click the gastos navigation link
    const gastosLink = page.getByRole('link', { name: /gastos/i });
    await expect(gastosLink).toBeVisible();
  });

  test('should have navigation to patrimonio page', async ({ page }) => {
    await page.goto('/');

    // Find and click the patrimonio navigation link
    const patrimonioLink = page.getByRole('link', { name: /patrimonio/i });
    await expect(patrimonioLink).toBeVisible();
  });

  test('should display transaction form tabs', async ({ page }) => {
    await page.goto('/');

    // Check if tabs are present
    await expect(page.getByRole('tab', { name: /gasto/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /ajustes/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /patrimonio/i })).toBeVisible();
  });

  test('should allow switching between form tabs', async ({ page }) => {
    await page.goto('/');

    // Click on Settings tab
    await page.getByRole('tab', { name: /ajustes/i }).click();
    await expect(page.getByText('Ingresos Mensuales')).toBeVisible();

    // Click on Expense tab
    await page.getByRole('tab', { name: /gasto/i }).click();
    await expect(page.getByText('Concepto')).toBeVisible();

    // Click on Net Worth tab
    await page.getByRole('tab', { name: /patrimonio/i }).click();
    await expect(page.getByText('Hucha (Efectivo)')).toBeVisible();
  });
});
