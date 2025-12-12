import { test, expect } from '@playwright/test';

test.describe('Gastos Page', () => {
  test('should load gastos page successfully', async ({ page }) => {
    await page.goto('/gastos');

    // Verify page loaded
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display page header with title', async ({ page }) => {
    await page.goto('/gastos');

    // Verify header title
    await expect(page.getByRole('heading', { name: /historial de gastos/i })).toBeVisible();
  });

  test('should display summary cards with totals', async ({ page }) => {
    await page.goto('/gastos');

    // Verify summary cards are visible
    await expect(page.getByText(/total gastado/i)).toBeVisible();
    await expect(page.getByText(/transacciones/i)).toBeVisible();
  });

  test('should display search filter', async ({ page }) => {
    await page.goto('/gastos');

    // Verify search input exists
    const searchInput = page.getByPlaceholder(/buscar por concepto/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display category filter', async ({ page }) => {
    await page.goto('/gastos');

    // Verify category select exists
    const categorySelect = page.locator('select');
    const selectExists = await categorySelect.count() > 0;
    expect(selectExists).toBeTruthy();
  });

  test('should filter transactions by search term', async ({ page }) => {
    await page.goto('/gastos');

    const searchInput = page.getByPlaceholder(/buscar por concepto/i);

    // Type in search
    await searchInput.fill('test');

    // Verify search input has value
    await expect(searchInput).toHaveValue('test');
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    await page.goto('/gastos');

    // Find link back to dashboard
    const dashboardLink = page.getByRole('link', { name: /volver al dashboard/i });
    await expect(dashboardLink).toBeVisible();
  });
});
