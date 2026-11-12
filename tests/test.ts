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

test('serves self-hosted variable fonts without external Google Fonts requests and preserves /ogt/landing-page 302 redirect', async ({
	page
}) => {
	const googleFontRequests: string[] = [];
	page.on('request', (req) => {
		const url = req.url();
		if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
			googleFontRequests.push(url);
		}
	});

	await page.goto('/');
	const fontFamily = await page.evaluate(
		() => getComputedStyle(document.documentElement).fontFamily
	);
	expect(fontFamily).toContain('Inter Variable');
	expect(googleFontRequests).toHaveLength(0);

	await page.goto('/ogt/landing-page?gclid=TeSt_GcLiD_987XYZ');
	expect(page.url()).toContain('?gclid=test_gclid_987xyz');
	await expect(page.getByText('test_gclid_987xyz').first()).toBeVisible();
});

test('contact SHA-256 verifier displays hex, base64, and base64url digests for email and phone', async ({
	page
}) => {
	await page.goto('/contact');
	await page.fill('#email', 'Alex.Morgan@gmail.com');
	await page.fill('#phone', '+1 555 234 5678');
	await page.click('button[type="submit"]');

	const status = page.getByRole('status');
	await expect(status).toBeVisible();
	await expect(status).toContainText('alexmorgan@gmail.com');
	await expect(status).toContainText('+15552345678');
	await expect(status).toContainText('SHA-256 (hex):');
	await expect(status).toContainText('SHA-256 (base64):');
	await expect(status).toContainText('SHA-256 (base64url):');
});
