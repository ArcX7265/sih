import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
export default defineConfig({
  testDir: './tests',
  testMatch: 'browser.spec.ts',
  workers: 1,
  timeout: 45_000,
  reporter: 'list',
  use: {
    baseURL,
    channel: process.platform === 'win32' ? 'msedge' : 'chromium',
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${new URL(baseURL).port || 3000}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
