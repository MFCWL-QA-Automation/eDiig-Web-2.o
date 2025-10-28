import { test } from "@playwright/test";
import { AuctionCreationPage } from "../pages/AuctionCreationPage";
import { testConfig } from "../config/testConfig";

// Apply slow motion only for this file
test.use({ launchOptions: { slowMo: 800 } });
test.describe("Auction Creation Flow", () => {
  test("Create a new auction successfully", async ({ page }) => {
    const auctionPage = new AuctionCreationPage(page);

    await auctionPage.login(testConfig.credentials.cmsUsername, testConfig.credentials.cmsPassword);
    
    await auctionPage.createAuctionFlow("test-data/Vdata.xlsx");
    
    //"C:\Mfcwl Projects\ediig-test\test-data\Vdata.xlsx"
    //await page.waitForTimeout(10000); // Pause for 10 seconds to observe the result
  });
});
