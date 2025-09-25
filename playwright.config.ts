import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
	timeout: 60 * 1000, //30000 ms(30 secs) // 30 seconds global test timeout
	testDir: './tests',
	fullyParallel: false,
	//retries: process.env.CI ? 2 : 0,
	//retries: 1,
	//workers: process.env.CI ? 1 : undefined,
	//workers: 1,
	reporter: [
		['html', { outputFolder: './reports/html-report' }],
		['allure-playwright', { outputFolder: './reports/allure-results' }],
    ['list'] // Using only list reporter for console output
	],
	use: {
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		//headless: false,
		viewport: { width: 1280, height: 720 }, // Set default viewport size for consistency
		ignoreHTTPSErrors: true, // Ignore SSL errors if necessary
		permissions: ['geolocation'], // Set necessary permissions for geolocation-based tests
		actionTimeout: 15000, // milliseconds // per-action timeout (15 seconds)
	},
	outputDir: './test-results/', // Directory for test artifacts
	//grep: /@master/,
	projects: [
		{
			name: 'chromium',use: { ...devices['Desktop Chrome'] },
		},
		/*{
		  name: 'firefox',use: { ...devices['Desktop Firefox'] },
		},
		{
		name: 'webkit',use: { ...devices['Desktop Safari'] },
		} */
	],
});