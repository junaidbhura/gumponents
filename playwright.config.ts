/**
 * Playwright configuration for Gumponents e2e tests.
 */
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:8889';
const STORAGE_STATE_PATH = path.join(
	process.cwd(),
	'artifacts/storage-states/admin.json'
);

export default defineConfig( {
	testDir: './specs',
	testIgnore: [ '**/setup/**' ],
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
			name: 'setup',
			testDir: './specs/setup',
			testMatch: '**/*.setup.ts',
		},
		{
			name: 'chromium',
			dependencies: [ 'setup' ],
			use: {
				...devices[ 'Desktop Chrome' ],
				storageState: STORAGE_STATE_PATH,
			},
		},
	],
	webServer: {
		command: 'npm run wp-env start',
		url: baseURL,
		reuseExistingServer: true,
		timeout: 120_000,
	},
} );
