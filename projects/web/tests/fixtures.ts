import { test as base, type Page } from '@playwright/test';

export const userNames = [
  'Alice Anderson', 'Bob Brown', 'Charlie Clark', 'Diana Davis', 'Eva Evans',
  'Frank Fischer', 'Grace Garcia', 'Henry Harris', 'Iris Ivanov', 'Jack Johnson',
  'Kate Kim', 'Leo Lee', 'Mia Martinez', 'Noah Nguyen', 'Olivia O\'Brien',
  'Peter Patel', 'Quinn Quinn', 'Rachel Rodriguez', 'Sam Smith', 'Tina Taylor',
  'Uma Ueda', 'Victor Vargas', 'Wendy Wilson', 'Xavier Xu', 'Yara Yang',
  'Zack Zhang', 'Amy Abbott', 'Ben Barnes', 'Claire Cooper', 'Dan Diaz',
  'Emma Edwards', 'Felix Foster', 'Gina Green', 'Hugo Hill', 'Ivy Ibrahim',
  'James Jones', 'Kylie Khan', 'Liam Lopez', 'Maya Miller', 'Nick Nelson'
];

// Helper to wait for the page to be fully initialized
export const waitForPageInit = async (page: Page): Promise<void> => {
  await page.waitForLoadState('networkidle');
  // Wait for demo data to be loaded (users dropdown populated)
  await page.waitForFunction(() => {
    const sel = document.querySelector('#user-select') as HTMLSelectElement;
    return sel && sel.options.length > 1;
  }, { timeout: 5000 });
};

interface DashboardFixtures {
  navigateToLanding: () => Promise<void>;
  selectUserAndNavigate: (userName: string, index?: number) => Promise<void>;
  getCurrentUserId: () => Promise<number | null>;
}

export const test = base.extend<DashboardFixtures>({
  navigateToLanding: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/');
      await waitForPageInit(page);
    });
  },

  selectUserAndNavigate: async ({ page }, use) => {
    await use(async (userName: string, index = 1) => {
      await page.goto('/');
      await waitForPageInit(page);

      if (userName) {
        await page.getByLabel('Select your name').selectOption({ label: userName });
      } else {
        await page.getByLabel('Select your name').selectOption({ index });
      }

      await page.getByRole('button', { name: 'Continue' }).click();
      await page.waitForURL(/\/dashboard\/\d+/);
      await page.waitForLoadState('networkidle');
    });
  },

  getCurrentUserId: async ({ page }, use) => {
    await use(async () => {
      const url = page.url();
      const match = url.match(/\/dashboard\/(\d+)/);
      return match ? parseInt(match[1]) : null;
    });
  }
});

export { expect } from '@playwright/test';

export const getRandomUserName = (): string => {
  return userNames[Math.floor(Math.random() * userNames.length)];
};

export const getUserNameById = (id: number): string => {
  return userNames[id - 1] || '';
};

export const getUserIdByName = (name: string): number => {
  return userNames.indexOf(name) + 1;
};
