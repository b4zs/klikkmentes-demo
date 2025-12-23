import { test, expect, getRandomUserName } from './fixtures';

test.describe('Complete User Flows', () => {
  test('full user journey from landing to dashboard', async ({ page, selectUserAndNavigate }) => {
    const userName = getRandomUserName();
    await selectUserAndNavigate(userName);

    // Verify user is on dashboard
    await expect(page.getByRole('heading', { name: userName })).toBeVisible();
    await expect(page.getByText('Klikkmentes December 2025')).toBeVisible();
  });

  test('user can switch between multiple accounts', async ({ page, selectUserAndNavigate }) => {
    // First user
    await selectUserAndNavigate('Alice Anderson');
    await expect(page.getByRole('heading', { name: 'Alice Anderson' })).toBeVisible();

    // Switch to another user
    await page.getByRole('button', { name: 'Switch User' }).click();
    await expect(page).toHaveURL('/');

    await page.getByLabel('Select your name').selectOption({ label: 'Bob Brown' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Bob Brown' })).toBeVisible();
  });

  test('dashboard displays all sections consistently for different users', async ({ page, selectUserAndNavigate }) => {
    const testUsers = ['Charlie Clark', 'Diana Davis', 'Eva Evans'];

    for (const userName of testUsers) {
      await selectUserAndNavigate(userName);

      // Check all sections are present
      await expect(page.getByRole('heading', { name: userName })).toBeVisible();
      await expect(page.getByRole('heading', { name: /event/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Your Table' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    }
  });

  test('user can navigate back and forth between pages', async ({ page, selectUserAndNavigate }) => {
    await selectUserAndNavigate('Frank Fischer');

    // Go back to landing
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Go forward to dashboard
    await page.goForward();
    await expect(page).toHaveURL(/\/dashboard\/\d+/);
    await expect(page.getByRole('heading', { name: 'Frank Fischer' })).toBeVisible();
  });

  test('page state is maintained during navigation', async ({ page, selectUserAndNavigate }) => {
    await selectUserAndNavigate('Grace Garcia');

    // Switch user button should be visible
    const switchButton = page.getByRole('button', { name: 'Switch User' });
    await expect(switchButton).toBeVisible();

    // Navigate away and back
    await page.goto('/');
    await page.goBack();

    // Elements should still be visible
    await expect(switchButton).toBeVisible();
  });
});

test.describe('Data-Driven User Tests', () => {
  const sampleUsers = ['Henry Harris', 'Iris Ivanov', 'Jack Johnson'];

  for (const userName of sampleUsers) {
    test(`user ${userName} can access their dashboard`, async ({ page, selectUserAndNavigate }) => {
      await selectUserAndNavigate(userName);

      await expect(page.getByRole('heading', { name: userName })).toBeVisible();
      await expect(page.getByText('Klikkmentes December 2025')).toBeVisible();
    });
  }
});

test.describe('Multi-User Scenarios', () => {
  test('simulating two different users accessing the system', async ({ context, page }) => {
    // First user
    await page.goto('/');
    await page.getByLabel('Select your name').selectOption({ label: 'Kate Kim' });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await expect(page.getByRole('heading', { name: 'Kate Kim' })).toBeVisible();

    // Create a new page for second user
    const secondPage = await context.newPage();
    await secondPage.goto('/');
    await secondPage.getByLabel('Select your name').selectOption({ label: 'Leo Lee' });
    await secondPage.getByRole('button', { name: 'Continue' }).click();
    await secondPage.waitForURL(/\/dashboard\/\d+/);
    await expect(secondPage.getByRole('heading', { name: 'Leo Lee' })).toBeVisible();

    // Verify both have different URLs
    expect(page.url()).not.toBe(secondPage.url());

    await secondPage.close();
  });
});

test.describe('Session Management', () => {
  test('page refresh maintains dashboard view', async ({ page, selectUserAndNavigate }) => {
    await selectUserAndNavigate('Mia Martinez');

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Mia Martinez' })).toBeVisible();
  });

  test('user can access dashboard directly via URL', async ({ page }) => {
    // Go directly to user's dashboard URL
    await page.goto('/dashboard/14');

    await expect(page.getByRole('heading', { name: 'Noah Nguyen' })).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('landing page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);

    await expect(page.getByRole('heading', { name: 'Klikkmentes' })).toBeVisible();
  });

  test('dashboard loads quickly', async ({ page, selectUserAndNavigate }) => {
    const startTime = Date.now();
    await selectUserAndNavigate('Olivia O\'Brien');
    const loadTime = Date.now() - startTime;

    // Dashboard should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);

    await expect(page.getByRole('heading', { name: "Olivia O'Brien" })).toBeVisible();
  });
});
