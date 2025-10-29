import { Page, expect } from "@playwright/test";

/**
 * AuctionCreationPage
 * Encapsulates all actions and locators for creating auctions in CMS.
 */
export class AuctionCreationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 🔹 Locators
  private get emailInput() {
    return this.page.getByRole("textbox", { name: "Email *" });
  }

  private get passwordInput() {
    return this.page.getByRole("textbox", { name: "Password *" });
  }

  private get loginButton() {
    return this.page.getByRole("button", { name: "Login" });
  }

  private get uploadAuctionLink() {
    return this.page.getByRole("link", { name: "Upload Auction List" });
  }

  private get typeDropdown() {
    return this.page.locator("div").filter({ hasText: /^Type:$/ }).locator("button");
  }

  private get eventDropdown() {
    return this.page.locator("div").filter({ hasText: /^Event:$/ }).locator("div").nth(2);
  }

  private get sellerDropdown() {
    return this.page.locator("div").filter({ hasText: /^Seller:$/ }).getByPlaceholder("Select an option");
  }

  private get actionDropdown() {
    return this.page.locator("div").filter({ hasText: /^Action:$/ }).locator("div").nth(2);
  }

  private get chooseFileButton() {
    return this.page.getByRole("button", { name: "Choose File" });
  }

  private get startDateInput() {
    return this.page.locator("div").filter({ hasText: /^Start Date:/ }).getByPlaceholder("MM/DD/YYYY").nth(0);
    
  }

  private get endDateInput() {
    return this.page.locator("div").filter({ hasText: /^End Date:/ }).getByPlaceholder("MM/DD/YYYY");
  }

  private get endTimeInput() {
    return this.page.locator("div").filter({ hasText: /^End Date:/ }).getByPlaceholder("--:--");
  }

  private get submitButton() {
    return this.page.locator("a").filter({ hasText: "Submit" });
  }

  // 🔹 Methods

  async login(email: string, password: string) {
    await this.page.goto("https://qa-cms.ediig.com/admin/auth/login");
    await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.emailInput.fill(email);
    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async openAuctionUpload() {
    await this.uploadAuctionLink.click();
  }

  async selectAuctionType(type: "Event" | "Seller") {
    await this.typeDropdown.first().click();
    await this.page.getByRole("option", { name: type }).click();
  }

  async selectEvent(eventName?: string) {
    await this.eventDropdown.click();
    if (eventName) {
      await this.page.getByText(eventName, { exact: true }).click();
    } else {
      await this.page.getByRole("button", { name: "clear" }).click();
    }
  }

  async selectSeller(sellerName: string) {
    await this.sellerDropdown.click();
    await this.page.getByText(sellerName, { exact: true }).click();
  }

  async selectAction(action: string) {
    await this.actionDropdown.click();
    await this.page.getByText(action, { exact: true }).click();
  }

  async uploadAuctionFile(filePath: string) {
    await this.chooseFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.chooseFileButton.setInputFiles(filePath);
  }

  async selectDatesAndTime() {
    await this.page.waitForTimeout(1000); // wait for date picker to stabilize
    await this.startDateInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.startDateInput.click();
    await this.startDateInput.press("Enter");

    await this.endDateInput.click();
    await this.endDateInput.press("Enter");

    await this.endTimeInput.click();
    await this.page.getByText("23:00").click();
  }

  async submitAuction() {
    await this.submitButton.click();
  }
// Full Flow Method with alternate file option
  async createAuctionFlow(primaryFile: string, alternateFile: string = "test-data/Vdata2.xlsx") {
  await this.openAuctionUpload();
  await this.selectSeller("Automation Test");
  await this.selectAction("Bulk Create");
  await this.uploadAuctionFile(primaryFile);
  await this.selectDatesAndTime();
  await this.submitAuction();

  // Wait for popup to open
  const popupPromise = this.page.waitForEvent('popup');
  await this.page.getByRole('link', { name: 'Click Here to Check Status' }).click();
  const popup = await popupPromise;

  // Login in popup window
  await popup.getByRole('textbox', { name: 'Email *' }).fill('t.subrammanniam@mahindra.com');
  await popup.getByRole('textbox', { name: 'Password *' }).fill('SUBRAMMANNIAM@a1');
  await popup.getByRole('button', { name: 'Login' }).click();
  await popup.waitForLoadState('networkidle');
 const primaryStatus = await this.waitForStatusCompletion(popup);
 // If primary upload failed, retry with alternate file
 if (primaryStatus === "Failure") {
    console.warn(`Primary upload failed for ${primaryFile}. Retrying with ${alternateFile}...`);
    await popup.close();

  // Retry flow with alternate file
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await this.openAuctionUpload();
    await this.selectSeller("Automation Test");
    await this.selectAction("Bulk Create");
    await this.uploadAuctionFile(alternateFile);
    await this.selectDatesAndTime();
    await this.submitAuction();

    // Wait for popup again
    //await this.page.waitForTimeout(2000); // brief wait to ensure popup can be caught
    const popupRetryPromise = this.page.waitForEvent('popup');
    await this.page.getByRole('link', { name: 'Click Here to Check Status' }).click();
    const popupRetry = await popupRetryPromise;

    // Login again
    await popupRetry.getByRole('textbox', { name: 'Email *' }).fill('t.subrammanniam@mahindra.com');
    await popupRetry.getByRole('textbox', { name: 'Password *' }).fill('SUBRAMMANNIAM@a1');
    await popupRetry.getByRole('button', { name: 'Login' }).click();
  await popup.waitForLoadState('networkidle');
  const retryStatus = await this.waitForStatusCompletion(popupRetry);
// If retry also fails, throw error
   if (retryStatus === "Failure") {
      console.error(`Auction creation failed again with ${alternateFile}.`);
      throw new Error("Auction creation failed — both files resulted in Failure.");
    }

    console.log(`Auction creation successful with alternate file: ${alternateFile}`);
  } else {
    console.log(`Auction creation successful with primary file: ${primaryFile}`);
  }
}
async waitForStatusCompletion(page: Page): Promise<string> {
  
  const statusInput = page.getByRole('textbox', { name: 'status *' });
  await statusInput.waitFor({ state: 'visible', timeout: 10000 });
// Initial status check
  let currentStatus = await statusInput.inputValue();
  console.log(`Checking status: ${currentStatus}`);

  // Poll for 10 iterations (~50s total)
  for (let i = 0; i < 10; i++) {
    if (["Success", "Failure"].includes(currentStatus)) {
      console.log(`Final Status: ${currentStatus}`);
      return currentStatus;
    }
    console.log(`Still ${currentStatus}... retrying in 5s`);
    await page.waitForTimeout(5000);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await statusInput.waitFor({ state: 'visible', timeout: 10000 });
    currentStatus = await statusInput.inputValue();
  }

  throw new Error(`Timed out waiting for Success/Failure. Last status: ${currentStatus}`);
}
}