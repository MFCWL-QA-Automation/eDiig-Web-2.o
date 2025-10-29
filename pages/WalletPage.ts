import { Page, Locator, expect } from "@playwright/test";

export class WalletPage {
  private readonly page: Page;

  // top-level locators (outside iframe)
  readonly profileButton: Locator;
  readonly myTransactionsLink: Locator;
  readonly topUpButton: Locator;
  readonly amountInput: Locator;
  readonly addMoneyButton: Locator;
  readonly emdSuccessText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.profileButton = page.getByRole('button', { name: 'Profile' });
    this.myTransactionsLink = page.getByRole('link', { name: 'My Transactions' });
    this.topUpButton = page.getByRole('button', { name: 'Top-Up' });

    // input and Add Money button are on page (before iframe open)
    this.amountInput = page.locator("//span[@class='text-2xl text-black font-bold']");
    this.addMoneyButton = page.getByRole('button', { name: 'Add Money' });

    // success toast on main page after successful payment
    this.emdSuccessText = page.getByText('EMD Balance Added Successfully');
  }

  /* Navigate to transactions page */

  /* Open top-up modal and select an amount button (e.g. "+ ₹25,000") */
  async openTopUpAndSelectPreset(presetLabel = '+ ₹25,000') {
    await this.profileButton.click();
    await this.myTransactionsLink.click();
    await this.topUpButton.click();
    await this.page.waitForLoadState('networkidle');
    // click preset button (exact name from your script)
    await this.page.getByRole('button', { name: presetLabel }).click();
  }

  /* Click Add Money to trigger payment iframe */
  async clickAddMoney() {
    await this.addMoneyButton.click();
  }

  /* Return frame locator for the payment iframe */
  frameLocator() {
    // prefer frameLocator if there is only one iframe
    return this.page.frameLocator('iframe');
  }

  /* In-iframe actions: check overview, select Netbanking, choose bank and confirm from popup */
  async completeNetbankingSuccessFlow(bankButtonName = 'State Bank of India State') {
    // Wait for payment iframe to appear
    const frameLocator = this.frameLocator();
    await frameLocator.locator('[data-testid="overview-container"]').waitFor({ state: 'visible', timeout: 10000 });

    // Choose Netbanking tab and bank
    await frameLocator.getByTestId('Netbanking').click();

    // Wait for bank list and click bank button (this click opens a popup window)
    const popupPromise = this.page.waitForEvent('popup');
    await frameLocator.getByRole('button', { name: bankButtonName }).first().click();
    const bankPopup = await popupPromise;

    // In the bank popup do test flow (simulate success)
    await bankPopup.waitForLoadState('domcontentloaded');
    // Click 'Success' button in bank popup (your script used this)
    await bankPopup.getByRole('button', { name: 'Success' }).click();
    console.log("Clicked Success in bank popup.");

    // After popup closes, inside iframe we should see confirming/payment success headings
    await frameLocator.getByRole('heading', { name: 'Confirming Payment' }).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.screenshot({ path: 'Screenshots/confirming_payment.png', fullPage: false });
    console.log("Payment confirming step visible in iframe.");
    await frameLocator.getByRole('heading', { name: 'Payment Successful' }).waitFor({ state: 'visible', timeout: 10000 });
    console.log("Payment Successful step visible in iframe.");
    await this.page.screenshot({ path: 'Screenshots/payment_successful.png', fullPage: false });
  }

  async completeNetbankingFailureFlow(bankButtonName = 'State Bank of India State') {
    // Wait for payment iframe to appear
    const frameLocator = this.frameLocator();
    await frameLocator.locator('[data-testid="overview-container"]').waitFor({ state: 'visible', timeout: 10000 });

    // Choose Netbanking tab and bank
    await frameLocator.getByTestId('Netbanking').click();

    // Wait for bank list and click bank button (this click opens a popup window)
    const popupPromise = this.page.waitForEvent('popup');
    await frameLocator.getByRole('button', { name: bankButtonName }).first().click();
    const bankPopup = await popupPromise;

    // In the bank popup do test flow (simulate success)
    await bankPopup.waitForLoadState('domcontentloaded');
    // Click 'Failure' button in bank popup (your script used this)
    await bankPopup.getByRole('button', { name: 'Failure' }).click();
    console.log("Clicked Failure in bank popup.");
await frameLocator.getByRole('heading', { name: 'Confirming Payment' }).waitFor({ state: 'visible', timeout: 10000 });
    console.log("Payment confirming step visible in iframe.");
await expect(frameLocator.getByText('Payment could not be completed')).toBeVisible({ timeout: 10000 });
  console.log("Payment Failure message visible in iframe.");
    await this.page.screenshot({ path: 'Screenshots/payment_failure.png', fullPage: false });
    
  }
  /* Validate the success toast on main page */
  async expectEmdAdded() {
    await this.emdSuccessText.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.emdSuccessText).toBeVisible();
    console.log("EMD Balance Added Successfully toast is visible.");
    await this.page.screenshot({ path: 'Screenshots/emd_success_toast.png', fullPage: false });
   
  }
}
