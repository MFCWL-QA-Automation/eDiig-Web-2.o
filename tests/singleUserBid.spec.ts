import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AuctionPage } from "../pages/AuctionPage";
import { testConfig } from "../config/testConfig";

let loginPage: LoginPage;
let auctionPage: AuctionPage;

test.describe("Single User Bid Tests @reg", () => {

test.beforeEach(async ({ page }) => {
  console.log("Logging in before test...");

  loginPage = new LoginPage(page);
  auctionPage = new AuctionPage(page);

  await loginPage.goto();
  await loginPage.login(
    testConfig.credentials.username,
    testConfig.credentials.password
  );

  console.log("Login successful");
});

test.afterEach(async () => {
  console.log("Logging out after test...");
  await loginPage.logout();
  console.log("Logout completed");
  
});

// test("User should place a bid successfully", async () => {
//   console.log("Running General Bid Test...");
//   await auctionPage.openFirstAuction();
//   await auctionPage.placeBidOnFirstNotParticipated();
//   await auctionPage.validateStatusUpdate();
// });

test("User should place a bid in Open Auction", async () => {
  console.log(" Running Open Auction Bid Test...");
  await auctionPage.openAuction();
  await auctionPage.placeBidOnFirstNotParticipated();
  await auctionPage.validateStatusUpdate();
});

test("User should place a bid in Closed Auction", async () => {
  console.log("Running Closed Auction Bid Test...");
  await auctionPage.closedAuction();
  await auctionPage.placeBidOnFirstNotParticipated();
  await auctionPage.validateStatusUpdate();
});
});