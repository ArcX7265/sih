import { test, expect, type Page } from '@playwright/test';

async function saved(page: Page) {
  return page.evaluate(() => new Promise<{ revision: number; workspace: { reminders: unknown[]; deposits: { id: string; status: string; versions: unknown[]; documents: unknown[] }[] } }>((resolve, reject) => {
    const open = indexedDB.open('nidhisetu-frontend-demo-v1', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction('workspace');
      const request = tx.objectStore('workspace').get('current');
      request.onsuccess = () => resolve(request.result);
      tx.oncomplete = () => open.result.close();
    };
  }));
}

async function ready(page: Page) {
  await page.goto('/');
  await expect(page.locator('.register-footer')).toContainText('Showing 7 of 7');
}

async function persona(page: Page, role: string) {
  await page.getByLabel('Demo persona').selectOption(role);
  await expect(page.locator('.register-footer')).toBeVisible();
}

async function openDeposit(page: Page, reference: string) {
  await page.locator('.deposit-table tbody tr').filter({ hasText: reference }).locator('.institution-cell').click();
  await expect(page.getByRole('dialog', { name: 'Deposit workspace' })).toBeVisible();
}

test('loads without backend/auth, scopes personas, and renders on mobile', async ({ page }, testInfo) => {
  const apiRequests: string[] = [];
  const errors: string[] = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await expect(page.getByText('Browser demo', { exact: true })).toBeVisible();
  await persona(page, 'institution');
  await expect(page.locator('.register-footer')).toContainText('Showing 3 of 3');
  await expect(page.locator('.deposit-table')).not.toContainText('Kaveri');
  await persona(page, 'authority');
  await expect(page.locator('.register-footer')).toContainText('Showing 7 of 7');
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText('Browser demo', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
  expect(apiRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('submits a deposit, rejects spoofed uploads, and preserves uploaded bytes across reload', async ({ page }) => {
  await ready(page);
  await page.getByRole('button', { name: 'New deposit', exact: true }).click();
  const form = page.getByRole('dialog', { name: 'Submit a new deposit' });
  await form.getByLabel('FDR reference', { exact: true }).fill('VERCEL-BROWSER-001');
  await form.getByLabel('Issuing bank', { exact: true }).fill('Synthetic Vercel Bank');
  await form.getByRole('button', { name: 'Submit deposit', exact: true }).click();
  await expect(form).not.toBeVisible();
  await openDeposit(page, 'VERCEL-BROWSER-001');
  await page.getByRole('tab', { name: 'Documents (0)' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'fake.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a PDF') });
  await expect(page.locator('.error-banner[role=alert]')).toContainText('matching file contents');
  const bytes = Buffer.from('%PDF-1.4\nSynthetic NidhiSetu test document. No real financial data.\n%%EOF');
  await page.locator('input[type=file]').setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: bytes });
  await expect(page.getByRole('tab', { name: 'Documents (1)' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.register-footer')).toContainText('Showing 8 of 8');
  await persona(page, 'institution');
  await openDeposit(page, 'VERCEL-BROWSER-001');
  await page.getByRole('tab', { name: 'Documents (1)' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('synthetic.pdf');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks)).toEqual(bytes);
  expect((await saved(page)).workspace.deposits).toHaveLength(8);
});

test('material correction requires fresh evidence and a document for the current version', async ({ page }) => {
  await ready(page);
  await persona(page, 'institution');
  await openDeposit(page, 'DCB-26-007215');
  await page.getByRole('button', { name: 'Edit / correct' }).click();
  const form = page.getByRole('dialog', { name: 'Correct deposit details' });
  await form.getByLabel('Deposit amount (₹)', { exact: true }).fill('1450000');
  await form.getByLabel('Reason for this change').fill('Corrected to match the simulated receipt amount.');
  await form.getByRole('button', { name: 'Save new version' }).click();
  await expect(form).not.toBeVisible();
  await page.getByRole('tab', { name: 'Documents (1)' }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'corrected.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nCorrected synthetic receipt\n%%EOF') });
  await expect(page.getByRole('tab', { name: 'Documents (2)' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await persona(page, 'officer');
  await openDeposit(page, 'DCB-26-007215');
  await expect(page.locator('.evidence-table')).toContainText('Needs refresh');
  await page.getByRole('button', { name: 'Accept verification' }).click();
  await expect(page.locator('.error-banner[role=alert]')).toBeVisible();
  await page.getByRole('button', { name: 'Matching response', exact: true }).click();
  await expect(page.locator('.evidence-state.match')).toHaveCount(5);
  await page.getByRole('button', { name: 'Accept verification' }).click();
  await expect(page.locator('.detail-top .status')).toHaveText('Verified');
  const record = (await saved(page)).workspace.deposits.find(item => item.id === 'FDR-2026-002');
  expect(record?.versions).toHaveLength(2);
});

test('authority approval and officer completion are separate persisted actions', async ({ page }) => {
  await ready(page);
  await persona(page, 'authority');
  await openDeposit(page, 'DUB-25-002910');
  await page.getByRole('button', { name: 'Approve release', exact: true }).click();
  await expect(page.locator('.detail-top .status')).toHaveText('Release approved');
  await expect(page.getByRole('button', { name: 'Record completion' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await persona(page, 'officer');
  await openDeposit(page, 'DUB-25-002910');
  await page.getByRole('button', { name: 'Record completion', exact: true }).click();
  await expect(page.getByText('Lifecycle completed', { exact: true }).last()).toBeVisible();
  await page.reload();
  await expect(page.locator('.register-footer')).toBeVisible();
  expect((await saved(page)).workspace.deposits.find(item => item.id === 'FDR-2026-004')?.status).toBe('released');
});

test('deduplicates reminders and rejects stale changes from a second tab', async ({ page, context }) => {
  await ready(page);
  const other = await context.newPage();
  await ready(other);
  await page.getByRole('button', { name: 'Maturity watch', exact: true }).click();
  await other.getByRole('button', { name: 'Maturity watch', exact: true }).click();
  await page.getByRole('button', { name: 'Run reminders' }).click();
  await expect(page.getByRole('status')).toContainText('Maturity reminders generated');
  const first = await saved(page);
  expect(first.workspace.reminders.length).toBeGreaterThan(0);
  await other.getByRole('button', { name: 'Run reminders' }).click();
  await expect(other.locator('.error-banner[role=alert]')).toContainText('changed in another tab');
  expect((await saved(page)).revision).toBe(first.revision);
  await page.getByRole('button', { name: 'Run reminders' }).click();
  await expect.poll(async () => (await saved(page)).revision).toBe(first.revision + 1);
  expect((await saved(page)).workspace.reminders).toEqual(first.workspace.reminders);
});

test('separate browser contexts get independent synthetic workspaces', async ({ page, browser }) => {
  await ready(page);
  await page.getByRole('button', { name: 'Maturity watch', exact: true }).click();
  await page.getByRole('button', { name: 'Run reminders' }).click();
  await expect(page.getByRole('status')).toContainText('Maturity reminders generated');
  const independent = await browser.newContext();
  try {
    const other = await independent.newPage();
    await other.goto(page.url());
    await expect(other.locator('.register-footer')).toContainText('revision 0');
    expect((await saved(other)).workspace.reminders).toEqual([]);
  } finally { await independent.close(); }
});
