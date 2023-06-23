import { test, expect } from '@playwright/test';
import { pageGoTo } from '../page-goto';

test('has title', async ({ page }) => {
  await pageGoTo(page, '/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Home Page');
});
