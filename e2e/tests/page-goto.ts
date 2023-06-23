import { Page } from '@playwright/test';

export async function pageGoTo(page: Page, url: string, timeout = 6000) {
  await page.waitForTimeout(timeout);
  await page.goto(url);
}
