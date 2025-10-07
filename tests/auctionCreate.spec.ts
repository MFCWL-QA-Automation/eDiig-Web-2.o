import { test } from "@playwright/test";
import { AuctionCreationPage } from "../pages/AuctionCreationPage";

  test("Create a new auction successfully", async ({ page }) => {
    const auctionPage = new AuctionCreationPage(page);

    await auctionPage.login("Kumar.B.Santha@mahindra.com", "Test@123");
    
    await auctionPage.createAuctionFlow("test-data/Vdata.xlsx");
    //"C:\Mfcwl Projects\ediig-test\test-data\Vdata.xlsx"
    await page.waitForTimeout(10000); // Pause for 10 seconds to observe the result
  });

