import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('index page renders expected title, heading, filter bar, and sections', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Technical Solutions Team');
	await expect(
		page.getByRole('heading', { name: 'Tagging that just works.', level: 1 })
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Lead Scoring', level: 2 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Enhanced Conversions', level: 2 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Search Ads 360', level: 2 })).toBeVisible();

	await page
		.getByRole('group', { name: 'Filter by category' })
		.getByRole('button', { name: 'Search Ads 360', exact: true })
		.click();
	await expect(page.getByRole('heading', { name: 'Search Ads 360', level: 2 })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Lead Scoring', level: 2 })).toHaveCount(0);
});

test('iframe, SA360, and OGT routes render cleanly with security headers', async ({ page }) => {
	for (const route of ['/iframe/typeform', '/iframe/calendly', '/sa360/googletag']) {
		const res = await page.goto(route);
		expect(res?.status()).toBe(200);
	}

	const dynamicRes = await page.goto('/ogt/landing-page?gclid=TeSt_GcLiD_987XYZ');
	expect(page.url()).toContain('?gclid=test_gclid_987xyz');
	expect(dynamicRes?.headers()['x-frame-options']).toBe('DENY');
	expect(dynamicRes?.headers()['x-content-type-options']).toBe('nosniff');
	expect(dynamicRes?.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
	await expect(page.getByText('test_gclid_987xyz').first()).toBeVisible();
});

test('pre-hashed enhanced conversions form computes SHA-256 digests and posts to /api/submissions', async ({
	page
}) => {
	const submissionPromise = page.waitForResponse(
		(res) => res.url().includes('/api/submissions') && res.request().method() === 'POST'
	);

	await page.goto('/adsenhancedconversions/prehash');
	await page.fill('#full-name', 'Jane Doe');
	await page.fill('#email', 'Jane.Doe@gmail.com');
	await page.fill('#tel', '+1 555 987 6543');
	await page.click('button[type="submit"]');

	const submissionRes = await submissionPromise;
	expect(submissionRes.status()).toBe(200);
	const submissionJson = await submissionRes.json();
	expect(submissionJson.success).toBe(true);
	expect(submissionJson.normalized.email).toBe('janedoe@gmail.com');

	await expect(page.locator('#form_success')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Copy JSON' })).toBeVisible();
	await expect(page.getByText('"janedoe@gmail.com"')).toBeVisible();
});

test('serves self-hosted variable fonts without external Google Fonts requests', async ({
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

test('meets WCAG 2.1/2.2 AA accessibility with zero axe-core violations in light and dark mode', async ({
	page
}) => {
	const routesToAudit = [
		'/',
		'/lead-scoring/multiple-checkbox',
		'/adsenhancedconversions/prehash',
		'/contact'
	];

	for (const route of routesToAudit) {
		await page.goto(route);

		// Light mode audit
		const lightAudit = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(lightAudit.violations, `Light mode a11y violations on ${route}`).toEqual([]);

		// Switch to dark mode and re-audit contrast & ARIA
		await page
			.getByRole('button', { name: /switch to dark theme/i })
			.first()
			.click();
		await expect(page.locator('html')).toHaveClass(/\bdark\b/);

		const darkAudit = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(darkAudit.violations, `Dark mode a11y violations on ${route}`).toEqual([]);

		// Reset back to light mode for next route
		await page
			.getByRole('button', { name: /switch to light theme/i })
			.first()
			.click();
	}

	// Verify skip link and inspector keyboard tab navigation
	await page.goto('/adsenhancedconversions/prehash');
	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

	const payloadTab = page.getByRole('tab', { name: 'Payload' });
	await payloadTab.focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
});
