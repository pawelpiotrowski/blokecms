import { test, expect } from '@playwright/test';
import { userName } from '../auth.credentials';
import { authenticate, authenticateAsUser } from '../auth';

test('login with wrong credentials', async ({ page }) => {
  await authenticate(page, 'John', 'password', true);
  await expect(page.locator('simple-snack-bar')).toContainText(
    '❗ Please check your credentials and try again',
  );
});

test('login with correct credentials', async ({ page }) => {
  await authenticateAsUser(page, true);
  await expect(page.getByTestId('account-nav-username')).toContainText(
    userName,
  );
});

test('logout', async ({ page }) => {
  await authenticateAsUser(page, true);
  await page.getByTestId('account-nav-menu-open').click();
  await page.getByTestId('account-nav-button-logout').click();
  await expect(page.getByTestId('login-form')).toBeVisible();
});
