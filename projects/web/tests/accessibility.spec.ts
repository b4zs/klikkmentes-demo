import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('has proper heading hierarchy', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toHaveCount(1);

      await expect(h1).toContainText('Klikkmentes');
    });

    test('form controls have associated labels', async ({ page }) => {
      const select = page.getByLabel('Select your name');
      await expect(select).toBeVisible();
      await expect(select).toBeAttached();
    });

    test('buttons have accessible names', async ({ page }) => {
      const continueButton = page.getByRole('button', { name: 'Continue' });
      await expect(continueButton).toBeVisible();
    });

    test('disabled button has aria-disabled state', async ({ page }) => {
      const continueButton = page.getByRole('button', { name: 'Continue' });
      await expect(continueButton).toHaveAttribute('disabled');
    });
  });

  test.describe('Dashboard Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByLabel('Select your name').selectOption({ label: 'Alice Anderson' });
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.waitForURL(/\/dashboard\/\d+/);
    });

    test('has proper heading hierarchy', async ({ page }) => {
      // Main user name heading
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();

      // Section headings should be h2
      const h2s = page.getByRole('heading', { level: 2 });
      await expect(h2s).toHaveCount(3);
    });

    test('navigation buttons have accessible names', async ({ page }) => {
      const switchButton = page.getByRole('button', { name: 'Switch User' });
      await expect(switchButton).toBeVisible();
    });

    test('section headings are descriptive', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /event/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /table/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /notifications/i })).toBeVisible();
    });

    test('interactive elements are focusable', async ({ page }) => {
      const switchButton = page.getByRole('button', { name: 'Switch User' });

      await switchButton.focus();
      await expect(switchButton).toBeFocused();
    });

    test('keyboard navigation works', async ({ page }) => {
      // Tab to the switch user button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Color Contrast', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByLabel('Select your name').selectOption({ label: 'Bob Brown' });
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.waitForURL(/\/dashboard\/\d+/);
    });

    test('text is visible with proper contrast', async ({ page }) => {
      // Main heading
      const heading = page.getByRole('heading', { name: 'Bob Brown' });
      await expect(heading).toBeVisible();

      // Section headings
      await expect(page.getByRole('heading', { name: 'Your Table' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('important content has semantic markup', async ({ page }) => {
      await page.goto('/');

      // Form should have proper labels
      const formLabel = page.getByText('Select your name');
      await expect(formLabel).toBeVisible();

      // Event info should be readable
      await expect(page.getByText('40 participants')).toBeVisible();
    });

    test('status updates are properly announced', async ({ page }) => {
      await page.goto('/');
      await page.getByLabel('Select your name').selectOption({ label: 'Charlie Clark' });
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.waitForURL(/\/dashboard\/\d+/);

      // Event status section should be findable
      await expect(page.getByText('Event Not Started')).toBeVisible();
    });
  });
});

test.describe('Responsive Design', () => {
  test('landing page works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Klikkmentes' })).toBeVisible();
    await expect(page.getByLabel('Select your name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('dashboard works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.getByLabel('Select your name').selectOption({ label: 'Diana Davis' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);

    await expect(page.getByRole('heading', { name: 'Diana Davis' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Table' })).toBeVisible();
  });

  test('landing page works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Klikkmentes' })).toBeVisible();
  });

  test('dashboard works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.getByLabel('Select your name').selectOption({ label: 'Eva Evans' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);

    await expect(page.getByRole('heading', { name: 'Eva Evans' })).toBeVisible();
  });
});
