import { test, expect, waitForPageInit } from './fixtures';

test.describe('EventStatus Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageInit(page);
    await page.getByLabel('Select your name').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await page.waitForLoadState('networkidle');
  });

  test('shows event not started state initially', async ({ page }) => {
    await expect(page.getByText('Event Not Started')).toBeVisible();
    await expect(page.getByText('Waiting for the event to begin...')).toBeVisible();
  });

  test('round progress indicator shows no active rounds initially', async ({ page }) => {
    // All round indicators should be gray (inactive)
    const roundIndicators = page.locator('.bg-gray-200.rounded-full');
    await expect(roundIndicators).toHaveCount(5);
  });

  test('displays current round when event starts', async ({ page }) => {
    // After event starts, round indicator should be visible
    // Note: This test would need the scheduler to have run
    // For now we check the structure is in place
    await expect(page.getByText('of 5 rounds')).toBeVisible();
  });

  test('displays time remaining section', async ({ page }) => {
    await expect(page.getByText('Time Remaining')).toBeVisible();
  });
});

test.describe('TableAssignment Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageInit(page);
    await page.getByLabel('Select your name').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await page.waitForLoadState('networkidle');
  });

  test('shows no assignment message before event starts', async ({ page }) => {
    await expect(page.getByText('No table assignment yet')).toBeVisible();
  });

  test('displays table number section heading', async ({ page }) => {
    await expect(page.getByText('Table Number')).toBeVisible();
  });

  test('shows tablemates heading when assignment is available', async ({ page }) => {
    // The heading should exist even if no tablemates yet
    await expect(page.getByText('Your Tablemates')).toBeVisible();
  });
});

test.describe('NotificationList Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageInit(page);
    await page.getByLabel('Select your name').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await page.waitForLoadState('networkidle');
  });

  test('shows empty state when no notifications', async ({ page }) => {
    await expect(
      page.getByText('No notifications yet')
    ).toBeVisible();
  });

  test('notifications section has correct styling', async ({ page }) => {
    // Check that the notifications card is visible
    const notificationsCard = page.locator('.bg-white.rounded-lg.shadow-md').filter({
      hasText: 'Notifications'
    });
    await expect(notificationsCard).toBeVisible();
  });

  test('has header bar for notifications section', async ({ page }) => {
    const header = page.locator('.px-6.py-4.bg-gray-50.border-b').filter({
      hasText: 'Notifications'
    });
    await expect(header).toBeVisible();
  });
});

test.describe('RoundProgress Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageInit(page);
    await page.getByLabel('Select your name').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await page.waitForLoadState('networkidle');
  });

  test('displays 5 round indicators', async ({ page }) => {
    // Total 5 rounds, all should be visible
    const roundLabels = page.locator('span.font-medium').filter(async (el) => {
      const text = await el.textContent();
      return /^\d$/.test(text ?? '');
    });

    await expect(roundLabels).toHaveCount(5);
  });

  test('round indicators are numbered 1-5', async ({ page }) => {
    const roundLabels = page.locator('span.font-medium').filter(async (el) => {
      const text = await el.textContent();
      return /^\d$/.test(text ?? '');
    });

    const labels = await roundLabels.allTextContents();
    expect(labels.sort()).toEqual(['1', '2', '3', '4', '5']);
  });

  test('all rounds show inactive state initially', async ({ page }) => {
    const inactiveRounds = page.locator('.bg-gray-200.rounded-full');
    await expect(inactiveRounds).toHaveCount(5);
  });
});

test.describe('Component Layout and Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageInit(page);
    await page.getByLabel('Select your name').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/dashboard\/\d+/);
    await page.waitForLoadState('networkidle');
  });

  test('all main sections have consistent card styling', async ({ page }) => {
    const cards = page.locator('.bg-white.rounded-lg.shadow-md');
    await expect(cards).toHaveCount(3); // Event Status, Table Assignment, Notifications
  });

  test('page has proper header structure', async ({ page }) => {
    await expect(page.locator('header.shadow-sm')).toBeVisible();
  });

  test('main content area is properly contained', async ({ page }) => {
    const mainContent = page.locator('main.max-w-4xl');
    await expect(mainContent).toBeVisible();
  });
});
