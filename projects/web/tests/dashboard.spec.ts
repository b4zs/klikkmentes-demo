import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page and select a user first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for users to load
    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    await page.getByLabel('Select your name').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await page.waitForLoadState('networkidle');
  });

  test('displays user name in header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Alice Anderson' })).toBeVisible();
  });

  test('displays event name in header', async ({ page }) => {
    await expect(page.getByText('Klikkmentes December 2025')).toBeVisible();
  });

  test('has switch user button in header', async ({ page }) => {
    const switchButton = page.getByRole('button', { name: 'Switch User' });
    await expect(switchButton).toBeVisible();
  });

  test('switch user button navigates to landing page', async ({ page }) => {
    const switchButton = page.getByRole('button', { name: 'Switch User' });
    await switchButton.click();
    await expect(page).toHaveURL('/');
  });

  test('displays event status section', async ({ page }) => {
    await expect(page.getByText('Event Not Started')).toBeVisible();
    await expect(page.getByText('Waiting for the event to begin...')).toBeVisible();
  });

  test('displays table assignment section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Table' })).toBeVisible();
  });

  test('shows no table assignment initially', async ({ page }) => {
    await expect(page.getByText('No table assignment yet')).toBeVisible();
    await expect(
      page.getByText('Your table will appear when the next round starts')
    ).toBeVisible();
  });

  test('displays notifications section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  });

  test('shows no notifications initially', async ({ page }) => {
    await expect(
      page.getByText('No notifications yet')
    ).toBeVisible();
  });

  test('all dashboard sections are visible', async ({ page }) => {
    // Event Status - check for the text instead
    await expect(page.getByText('Event Not Started')).toBeVisible();

    // Table Assignment
    await expect(page.locator('h2').filter({ hasText: 'Your Table' })).toBeVisible();

    // Notifications
    await expect(page.locator('h2').filter({ hasText: 'Notifications' })).toBeVisible();
  });
});

test.describe('Dashboard - Invalid User', () => {
  test('shows user not found message for invalid user id', async ({ page }) => {
    // Navigate directly to an invalid user dashboard
    await page.goto('/dashboard/999');

    await expect(page.getByText('User not found')).toBeVisible();
  });

  test('has go back button when user not found', async ({ page }) => {
    await page.goto('/dashboard/999');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('User not found')).toBeVisible();

    const goBackButton = page.getByRole('button', { name: 'Go back' });
    await expect(goBackButton).toBeVisible();
  });

  test('go back button navigates to landing page', async ({ page }) => {
    await page.goto('/dashboard/999');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('User not found')).toBeVisible();

    const goBackButton = page.getByRole('button', { name: 'Go back' });
    await goBackButton.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Dashboard - Different Users', () => {
  test('displays correct user name for different user', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    await page.getByLabel('Select your name').selectOption({ label: 'Bob Brown' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);

    await expect(page.getByRole('heading', { name: 'Bob Brown' })).toBeVisible();
  });

  test('multiple users can access their dashboards', async ({ page }) => {
    // First user
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    await page.getByLabel('Select your name').selectOption({ label: 'Charlie Clark' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/dashboard\/\d+/);
    await expect(page.getByRole('heading', { name: 'Charlie Clark' })).toBeVisible();

    // Switch to another user
    await page.getByRole('button', { name: 'Switch User' }).click();
    await page.waitForURL('/');

    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    await page.getByLabel('Select your name').selectOption({ label: 'Diana Davis' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Diana Davis' })).toBeVisible();
  });
});
