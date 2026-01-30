/**
 * Playwright configuration for Gumponents e2e tests.
 */
import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:8889';

export default defineConfig( {
	testDir: './specs',
	outputDir: './tests/e2e/artifacts',
	fullyParallel: false,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ] },
		},
	],
	webServer: {
		command: 'npm run wp-env start',
		url: baseURL,
		reuseExistingServer: true,
		timeout: 120_000,
	},
} );
