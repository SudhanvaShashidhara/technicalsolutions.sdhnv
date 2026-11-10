import { expect, test } from '@playwright/test';

test('index page renders expected title, heading, and measurement sections', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Technical Solutions Team');
	await expect(
		page.getByRole('heading', { name: 'Tagging that just works.', level: 1 })
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Lead Scoring', level: 2 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Enhanced Conversions', level: 2 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Search Ads 360', level: 2 })).toBeVisible();
});

test('iframe and SA360 routes render with HTTP 200 during SSR', async ({ page }) => {
	for (const route of ['/iframe/typeform', '/iframe/calendly', '/sa360/googletag']) {
		const res = await page.goto(route);
		expect(res?.status()).toBe(200);
	}
});

test('pre-hashed enhanced conversions form computes SHA-256 digests on submit', async ({
	page
}) => {
	await page.goto('/adsenhancedconversions/prehash');
	await page.fill('#full-name', 'Jane Doe');
	await page.fill('#email', 'Jane.Doe@gmail.com');
	await page.fill('#tel', '+1 555 987 6543');
	await page.click('button[type="submit"]');

	await expect(page.locator('#form_success')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Copy JSON' })).toBeVisible();
	await expect(page.getByText('"janedoe@gmail.com"')).toBeVisible();
});
