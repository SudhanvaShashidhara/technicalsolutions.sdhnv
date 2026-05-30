import { expect, test } from '@playwright/test';

test('index page has expected title and heading', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Technical Solution Team');
	await expect(page.getByRole('heading', { name: 'Deploy faster' })).toBeVisible();
});
