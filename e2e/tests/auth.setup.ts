import { Page, test as setup } from '@playwright/test';
import { authenticateAsAdmin, authenticateAsUser } from './auth';

async function setupAuth(
  page: Page,
  authMethod: (p: Page) => Promise<void>,
  authFileName: string,
) {
  // Perform authentication.
  await authMethod(page);
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/admin/dashboard');
  // Store authentication to be reused in tests.
  await page
    .context()
    .storageState({ path: `playwright/.auth/${authFileName}` });
}

setup('authenticate as admin @setup', async ({ page }) => {
  await setupAuth(page, authenticateAsAdmin, 'admin.json');
});

setup('authenticate as user @setup', async ({ page }) => {
  await setupAuth(page, authenticateAsUser, 'user.json');
});
