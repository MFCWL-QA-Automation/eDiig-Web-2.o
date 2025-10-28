import { test, expect, chromium, Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AuctionPage } from "../pages/AuctionPage";
import { testConfig } from "../config/testConfig";

let browser: Browser;
let contextUser1: BrowserContext;
let contextUser2: BrowserContext;
let pageUser1: Page;
let pageUser2: Page;
let loginPageUser1: LoginPage;
let loginPageUser2: LoginPage;
let auctionUser1: AuctionPage;
let auctionUser2: AuctionPage;

test.describe("Multi-User Bid Tests @reg" , () => {

test.beforeEach(async () => {
  console.log("Setting up browser and users...");
  browser = await chromium.launch({ headless: false });

  contextUser1 = await browser.newContext();
  contextUser2 = await browser.newContext();

  pageUser1 = await contextUser1.newPage();
  pageUser2 = await contextUser2.newPage();

  loginPageUser1 = new LoginPage(pageUser1);
  loginPageUser2 = new LoginPage(pageUser2);

  await loginPageUser1.goto();
  await loginPageUser1.login(
    testConfig.credentials.username1,
    testConfig.credentials.password1
  );

  await loginPageUser2.goto();
  await loginPageUser2.login(
    testConfig.credentials.username2,
    testConfig.credentials.password2
  );

  expect(await loginPageUser1.isLoggedIn()).toBeTruthy();
  expect(await loginPageUser2.isLoggedIn()).toBeTruthy();

  auctionUser1 = new AuctionPage(pageUser1);
  auctionUser2 = new AuctionPage(pageUser2);
  console.log("Both users logged in and ready.");
});

test.afterEach(async () => {
  console.log(" Cleaning up: Logging out and closing browser...");
  try {
    await loginPageUser1.logout();
    await loginPageUser2.logout();
  } catch (e) {
    console.warn("Logout failed (possibly already logged out):", e);
  }
  await browser.close();
  console.log("Cleanup done.");
});

async function runMultiUserBidFlow(type: "general" | "open" | "closed") {
  console.log(`Starting Multi-User Bid Test: ${type.toUpperCase()}`);

  // Open auction type for both users
  if (type === "open") {
    await auctionUser1.openAuction();
    await auctionUser2.openAuction();
  } else if (type === "closed") {
    await auctionUser1.closedAuction();
    await auctionUser2.closedAuction();
  } else {
    await auctionUser1.openFirstAuction();
    await auctionUser2.openFirstAuction();
  }

  // User 1 bids first
  const regNo = await auctionUser1.placeBidOnFirstNotParticipated();
  console.log(" User 1 placed bid on:", regNo);

  await pageUser1.waitForTimeout(2000);

  // User 2 bids next
  const regNoUser2 = await auctionUser2.placeBidOnFirstNotParticipated();
  console.log("User 2 placed bid on:", regNoUser2);

  // Verify both bid on same vehicle
  expect(regNoUser2).toBe(regNo);
  console.log("Both users bid on same Reg No:", regNo);

  // Verify Outbid status
  await pageUser1.waitForTimeout(1000); // Wait for status to update
  await auctionUser1.validateStatusUpdateForRegNo(regNo, "Outbid");
  console.log(`${regNo} → User1 = Outbid, User2 = Winning`);
}

// ---- TESTS ---- //

// test("Multi-User Bid Test - General Auction", async () => {
//   await runMultiUserBidFlow("general");
// });

test("Multi-User Bid Test - Open Auction", async () => {
  await runMultiUserBidFlow("open");
});

test("Multi-User Bid Test - Closed Auction", async () => {
  await runMultiUserBidFlow("closed");
});
});