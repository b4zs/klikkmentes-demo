import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to fully initialize (demo data loading)
    await page.waitForLoadState('networkidle');
  });

  test('displays the app title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Klikkmentes' })).toBeVisible();
    await expect(page.getByText('No-Clique Party')).toBeVisible();
  });

  test('displays event information', async ({ page }) => {
    await expect(page.getByText('40 participants')).toBeVisible();
    await expect(page.getByText('10 tables')).toBeVisible();
    await expect(page.getByText('5 rounds')).toBeVisible();
  });

  test('has user selection dropdown', async ({ page }) => {
    const select = page.getByLabel('Select your name');
    await expect(select).toBeVisible();
  });

  test('contains 40 user options in dropdown', async ({ page }) => {
    const select = page.getByLabel('Select your name');

    // Wait for users to be loaded
    await expect(async () => {
      const optionCount = await page.locator('#user-select option').count();
      expect(optionCount).toBeGreaterThan(1);
    }).toPass({ timeout: 5000 });

    await select.click();
    const options = await page.locator('#user-select option').all();

    // One default option + 40 users
    expect(options.length).toBe(41);

    // Check some expected names exist
    const optionValues = await Promise.all(
      options.slice(1).map(option => option.textContent())
    );

    expect(optionValues).toContain('Alice Anderson');
    expect(optionValues).toContain('Zack Zhang');
  });

  test('continue button is disabled when no user is selected', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Continue' });
    await expect(button).toBeDisabled();
  });

  test('enables continue button after selecting a user', async ({ page }) => {
    const select = page.getByLabel('Select your name');
    const button = page.getByRole('button', { name: 'Continue' });

    // Wait for users to load
    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    await select.selectOption({ index: 1 }); // Select first user (index 0 is "Choose from list...")
    await expect(button).toBeEnabled();
  });

  test('navigates to dashboard when user is selected', async ({ page }) => {
    const select = page.getByLabel('Select your name');
    const button = page.getByRole('button', { name: 'Continue' });

    // Wait for users to load
    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    await select.selectOption({ index: 1 });
    await button.click();

    // Wait for navigation to complete
    await page.waitForURL(/\/dashboard\/\d+/, { timeout: 5000 });
  });

  test('dropdown is sorted alphabetically', async ({ page }) => {
    const select = page.getByLabel('Select your name');

    await select.click();
    const options = await page.locator('#user-select option').all();

    // Skip the first "Choose from list..." option
    const userOptions = options.slice(1);
    const names = await Promise.all(
      userOptions.map(option => option.textContent() ?? '')
    );

    // Check that names are sorted
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sortedNames);
  });
});

test.describe('User Selection - First User Starts Event', () => {
  test('first user selection starts the event and scheduler', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const select = page.getByLabel('Select your name');
    const button = page.getByRole('button', { name: 'Continue' });

    // Wait for users to load
    await page.waitForFunction(() => {
      const sel = document.querySelector('#user-select') as HTMLSelectElement;
      return sel && sel.options.length > 1;
    });

    // Select the first user
    await select.selectOption({ index: 1 });
    await button.click();

    // Wait for navigation to dashboard
    await page.waitForURL(/\/dashboard\/\d+/, { timeout: 5000 });

    // Dashboard should load
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
