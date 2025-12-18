import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('h1, h2')).toContainText(/login|sign in/i);
  });

  test('should show validation errors on empty form submission', async ({ page }) => {
    await page.goto('/auth');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for validation errors
    await expect(page.locator('text=/required|invalid/i').first()).toBeVisible();
  });
});
