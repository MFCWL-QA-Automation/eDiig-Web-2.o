import { test } from '@playwright/test';
import { WalletPage } from '../pages/WalletPage';
import { testConfig } from '../config/testConfig'; // optional, if you have credentials
import { LoginPage } from '../pages/LoginPage';

let loginPage: LoginPage;

test.describe.only('@wallet Wallet Top-up Flow', () => {

    test.beforeEach(async ({ page }) => {
      console.log("Logging in before test...");
    
      loginPage = new LoginPage(page);
    
      await loginPage.goto();
      await loginPage.login(
        testConfig.credentials.username,
        testConfig.credentials.password
      );
    
    });
    
  test('User can top-up wallet via Netbanking - Success Flow', async ({ page }) => {
    const wallet = new WalletPage(page);

    // Step 1: Navigate and open transactions - handled in beforeEach

    // Step 2: Open Top-Up modal and select preset amount
    await wallet.openTopUpAndSelectPreset('+ ₹25,000');

    // Step 2: Open Top-Up modal and select preset amount
    await wallet.openTopUpAndSelectPreset('+ ₹25,000');

    // Step 3: Click Add Money (this opens payment iframe)
    await wallet.clickAddMoney();

    // Step 4: Complete netbanking flow (handles popup)
    await wallet.completeNetbankingSuccessFlow('State Bank of India State');

    // Step 5: Validate EMD balance added success message
    await wallet.expectEmdAdded();
    await loginPage.logout();
    
  });
  test.only('User can top-up wallet via Netbanking - Failure Flow', async ({ page }) => {
    const wallet = new WalletPage(page);
    // Step 1: Navigate and open transactions handled in beforeEach
    
    // Step 2: Open Top-Up modal and select preset amount
    await wallet.openTopUpAndSelectPreset('+ ₹25,000');

    // Step 3: Click Add Money (this opens payment iframe)
    await wallet.clickAddMoney();

    // Step 4: Complete netbanking flow (handles popup)
    await wallet.completeNetbankingFailureFlow('State Bank of India State');
     });
});
