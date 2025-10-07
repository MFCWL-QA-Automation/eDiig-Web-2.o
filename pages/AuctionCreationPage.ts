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
    await this.emailInput.fill(email);
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
    await this.page.getByText("18:00").click();
  }

  async submitAuction() {
    await this.submitButton.click();
  }

  async createAuctionFlow(filePath: string) {
    await this.openAuctionUpload();
   // await this.selectAuctionType("Seller");
    await this.selectSeller("Adani Capital Private Limited");
    await this.selectAction("Bulk Create");
    await this.uploadAuctionFile(filePath);
    await this.selectDatesAndTime();
    await this.submitAuction();

    // Optional validation
   // await expect(this.page.locator("text=Auction Created Successfully")).toBeVisible({ timeout: 10000 });
  }
}
