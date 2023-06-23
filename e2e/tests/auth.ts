import { Page } from '@playwright/test';
import { adminName, adminPwd, userName, userPwd } from './auth.credentials';
import { pageGoTo } from './page-goto';

function goToLogin(page: Page, wait: boolean) {
  const loginUrl = '/admin/login';

  return wait ? pageGoTo(page, loginUrl) : page.goto(loginUrl);
}

export async function authenticate(
  page: Page,
  username: string,
  password: string,
  wait = false,
) {
  await goToLogin(page, wait);
  await page.getByLabel('Enter your username').fill(username);
  await page.getByLabel('Enter your password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function authenticateAsAdmin(page: Page, wait = false) {
  await authenticate(page, adminName, adminPwd, wait);
}

export async function authenticateAsUser(page: Page, wait = false) {
  await authenticate(page, userName, userPwd, wait);
}
