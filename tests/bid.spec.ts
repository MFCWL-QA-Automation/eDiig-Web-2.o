import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AuctionPage } from "../pages/AuctionPage";
import { testConfig } from "../config/testConfig";

test.skip("User should login and place a bid successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const auctionPage = new AuctionPage(page);

  await loginPage.goto();
  await loginPage.login(testConfig.credentials.username1, testConfig.credentials.password1);

  await auctionPage.openFirstAuction();
  await auctionPage.placeBidOnFirstNotParticipated();
  await auctionPage.validateStatusUpdate();
  //await page.waitForTimeout(10000); // Pause for 10 seconds to observe the result
  
});

test("User should login and place a bid successfully - Open Auction", async ({ page }) => {
  console.log("Starting Open Auction Bid Test");
  const loginPage = new LoginPage(page);
  const auctionPage = new AuctionPage(page);

  await loginPage.goto();
  await loginPage.login(testConfig.credentials.username2, testConfig.credentials.password2);

  await auctionPage.openAuction();
  await auctionPage.placeBidOnFirstNotParticipated();
  await auctionPage.validateStatusUpdate();
  //await page.waitForTimeout(10000); // Pause for 10 seconds to observe the result
  
});

test("User should login and place a bid successfully - Closed Auction", async ({ page }) => {
  console.log("Starting Closed Auction Bid Test");
  const loginPage = new LoginPage(page);
  const auctionPage = new AuctionPage(page);

  await loginPage.goto();
  await loginPage.login(testConfig.credentials.username1, testConfig.credentials.password1);

  await auctionPage.closedAuction();
  await auctionPage.placeBidOnFirstNotParticipated();
  await auctionPage.validateStatusUpdate();
  //await page.waitForTimeout(10000); // Pause for 10 seconds to observe the result
  
});