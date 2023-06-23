import { test, expect, Page } from '@playwright/test';
import packageJson from '../../package.json';
import { adminName, userName } from '../auth.credentials';
import { pageGoTo } from '../page-goto';

function gotoDashboard(page: Page) {
  return pageGoTo(page, '/admin/dashboard');
}

// Admin
test.describe('Role: admin', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test.beforeEach(async ({ page }) => {
    await gotoDashboard(page);
  });

  test('page toolbar', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
    await expect(page.getByTestId('account-nav-username')).toContainText(
      adminName,
    );
  });

  test('welcome title', async ({ page }) => {
    await expect(page.getByTestId('dashboard-welcome-title')).toContainText(
      `Hello ${adminName}, what would you like to do?`,
    );
  });

  test('insights version', async ({ page }) => {
    await expect(page.getByTestId('dashboard-insights-version')).toContainText(
      packageJson.version,
    );
  });

  test('insights links', async ({ page }) => {
    await expect(
      page.getByTestId('dashboard-insights').getByRole('link'),
    ).toHaveCount(5);
  });

  test('grid tiles', async ({ page }) => {
    await expect(page.getByTestId('dashboard-grid-tile')).toHaveCount(9);
  });
});

// User
test.describe('Role: user', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await gotoDashboard(page);
  });

  test('page toolbar', async ({ page }) => {
    await expect(page.getByTestId('account-nav-username')).toContainText(
      userName,
    );
  });

  test('welcome title', async ({ page }) => {
    await expect(page.getByTestId('dashboard-welcome-title')).toContainText(
      `Hello ${userName}, what would you like to do?`,
    );
  });

  test('grid tiles', async ({ page }) => {
    await expect(page.getByTestId('dashboard-grid-tile')).toHaveCount(5);
  });
});
