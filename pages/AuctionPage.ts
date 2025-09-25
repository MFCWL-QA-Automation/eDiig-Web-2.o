import { Page, Locator, expect } from "@playwright/test";

/**
 * AuctionPage class implements actions on the Auction page
 * using the Page Object Model (POM) design pattern.
 */
export class AuctionPage {
  private readonly page: Page;
  private lastBidRegNumber: string = ''; // Store the last bid registration number

  // Locators
  private readonly firstEvent: Locator;
  private readonly successMessage: Locator;
  private readonly tileLocator: Locator;
  private readonly errorAlert: Locator;
  private readonly outBidAlert: Locator;
  private readonly regNo: Locator;
  private readonly startPrice: Locator;
  private readonly reservePrive: Locator;

  constructor(page: Page) {
    this.page = page;

    // First auction event row
    this.firstEvent = page.locator("//section[@id='event-widget2']//table/tbody/tr[2]");

    // Locators for bidding on first "Not Participated" tiles
    this.tileLocator = page.locator("//li[.//div[@data-status='Not Participated']][1]");

    this.regNo = page.locator(
      "xpath=//li[.//div[@data-status='Not Participated']][1]//div[normalize-space()='Reg No']/following-sibling::div"
    );
    this.startPrice = page.locator(
      "xpath=//li[.//div[@data-status='Not Participated']][1]//div[normalize-space()='Start Price']/following-sibling::div"
    );
    this.reservePrive = page.locator(
      "xpath=//li[.//div[@data-status='Not Participated']][1]//div[normalize-space()='Reserve Price']/following-sibling::div"
    );

    // Success / Error messages
    this.successMessage = page.locator("//div[contains(text(),'Congratulations! Your bid of')]");
    this.errorAlert = page.locator("//div[contains(text(),'Bid Amount Should be greater than Start Price.')]");
    this.outBidAlert = page.locator(
      "//div[contains(text(),'Bid accepted, but you are not winning yet. Try increasing your bid to improve your chances')]"
    );
  }

  /**
   * Build bid input locator dynamically using Reg No
   */
  private get bidInput(): Locator {
    return this.page.locator(
      `//li[.//div[normalize-space()='${this.lastBidRegNumber}']]//input[@name='bid_amount']`
    );
  }

  /**
   * Build bid now button locator dynamically using Reg No
   */
  private get bidNowBtn(): Locator {
    return this.page.locator(
      `//li[.//div[normalize-space()='${this.lastBidRegNumber}']]//button[contains(@id,'bid-now')]`
    );
  }

  /**
   * Open the first auction event
   */
  async openFirstAuction(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.firstEvent.scrollIntoViewIfNeeded();
    await this.firstEvent.click();
  }

  /**
   * Place a bid on the first "Not Participated" auction tile.
   */
  async placeBidOnFirstNotParticipated(): Promise<void> {
    await this.tileLocator.waitFor({ state: 'visible', timeout: 5000 });
    await this.tileLocator.scrollIntoViewIfNeeded();

    // Extract Reg No, Start Price, Reserve Price
    await this.regNo.waitFor({ state: 'visible', timeout: 5000 });
    const regNumber = await this.regNo.innerText();
    this.lastBidRegNumber = regNumber; // store reg no for dynamic locators
    console.log("Placing bid on Reg No:", regNumber);

    await this.startPrice.waitFor({ state: 'visible', timeout: 5000 });
    await this.reservePrive.waitFor({ state: 'visible', timeout: 5000 });
    const startPriceText = await this.startPrice.innerText();
    const reservePriceText = await this.reservePrive.innerText();
    console.log(`Start Price: ${startPriceText}, Reserve Price: ${reservePriceText}`);

    

    let retries = 0;

    while (retries < 10) { // max attempts safeguard
      retries++;

      // Get bid input and current value
    const currentValue = await this.bidInput.inputValue();
    const numericValue = parseInt(currentValue.replace(/[^0-9]/g, ""), 10);

      // Calculate new bid (+5000)
      const newBid = numericValue + 5000;
      console.log(`Current Bid: ${numericValue}, Placing New Bid: ${newBid}`);

      // Clear existing value and enter new bid
      await this.bidInput.dblclick();
      await this.bidInput.fill(newBid.toString());

      // Click respective "Bid Now" button inside the same tile
      await this.bidNowBtn.click();

      await this.page.waitForTimeout(2000); // wait a bit for response

      if (await this.successMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log("Bid placed successfully!");
        break;
      }
      if (await this.outBidAlert.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log("Got outbid alert: Increasing bid and retrying...");
        continue; // loop again, increase amount further
      }
      if (await this.errorAlert.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log("Got error: Need higher bid, retrying...");
        continue; // loop again, increase amount further
      }
    }
  }

  /**
   * Validate that the status of the tile for the given Reg No has updated to "Winning".
   */
  async validateStatusUpdate(): Promise<void> {
    const updatedStatus = this.page.locator(
      `//li[.//div[normalize-space()='${this.lastBidRegNumber}']]//div[@data-status]`
    );

    await expect(updatedStatus).toHaveAttribute("data-status", "Winning", { timeout: 5000 });

    const statusText = await updatedStatus.textContent();
    console.log(
      `Updated status of Reg No ${this.lastBidRegNumber}: Not Participated to ${statusText?.trim()}`
    );
  }
}
