import { test, expect, chromium, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testConfig } from '../config/testConfig';

test.describe.skip('Login Functionality Tests', () => {
  let loginPage: LoginPage;
  let page: Page;

  // Before each test, create a new LoginPage instance
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({page}) => {
    await loginPage.login(
      testConfig.credentials.username,
      testConfig.credentials.password
    );

    // Verify successful login
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    console.log("Login successful for user:", testConfig.credentials.username);
    await loginPage.logout();
    console.log("Logout successful for user:", testConfig.credentials.username);
    
    
  });

  // New test for two different users logging in at the same time
  test('should allow two users to login simultaneously', async () => {
    const browser = await chromium.launch({ headless: false });

    // Create isolated sessions
    const contextUser1 = await browser.newContext();
    const contextUser2 = await browser.newContext();

    // Create pages
    const pageUser1 = await contextUser1.newPage();
    const pageUser2 = await contextUser2.newPage();

    // User 1 login
    const loginPageUser1 = new LoginPage(pageUser1);
    await loginPageUser1.goto();
    await loginPageUser1.login(
      testConfig.credentials.username1,
      testConfig.credentials.password1
    );
    expect(await loginPageUser1.isLoggedIn()).toBeTruthy();
    console.log("Login successful for user:", testConfig.credentials.username1);
    await loginPageUser1.logout();
    console.log("Logout successful for user:", testConfig.credentials.username1);

    // User 2 login
    const loginPageUser2 = new LoginPage(pageUser2);
    await loginPageUser2.goto();
    await loginPageUser2.login(
      testConfig.credentials.username2,
      testConfig.credentials.password2
    );
    expect(await loginPageUser2.isLoggedIn()).toBeTruthy();
    console.log("Login successful for user:", testConfig.credentials.username1);
    await loginPageUser2.logout();
    console.log("Logout successful for user:", testConfig.credentials.username1);

    // Optional: capture proof
    //await pageUser1.screenshot({ path: 'reports/user1-login.png' });
    //await pageUser2.screenshot({ path: 'reports/user2-login.png' });

    
  });
});
