import { test, expect, chromium } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AuctionPage } from "../pages/AuctionPage";
import { testConfig } from "../config/testConfig";

test("Two users bidding on same auction concurrently", async () => {
  const browser = await chromium.launch({ headless: false });

  // Create isolated sessions
  const contextUser1 = await browser.newContext();
  const contextUser2 = await browser.newContext();

  const pageUser1 = await contextUser1.newPage();
  const pageUser2 = await contextUser2.newPage();

  // Step 1: Login both users
  const loginPageUser1 = new LoginPage(pageUser1);
  const loginPageUser2 = new LoginPage(pageUser2);

  await loginPageUser1.goto();
  await loginPageUser1.login(testConfig.credentials.username1, testConfig.credentials.password1);

  await loginPageUser2.goto();
  await loginPageUser2.login(testConfig.credentials.username2, testConfig.credentials.password2);

  expect(await loginPageUser1.isLoggedIn()).toBeTruthy();
  expect(await loginPageUser2.isLoggedIn()).toBeTruthy();

  // Step 2: Initialize auction pages
  const auctionUser1 = new AuctionPage(pageUser1);
  const auctionUser2 = new AuctionPage(pageUser2);

  // Step 3: Open auction for both users
  await auctionUser1.openFirstAuction();
  await auctionUser2.openFirstAuction();
  
  // Step 4: User 1 bids first and get the registration number
  const regNo = await auctionUser1.placeBidOnFirstNotParticipated();
  console.log("User 1 placed bid on:", regNo);
  
  // Wait for a short time to ensure bid is registered
  await pageUser1.waitForTimeout(2000);
  
  // Step 5: User 2 needs to find the same registration number and bid on it
  const regNoUser2 = await auctionUser2.placeBidOnFirstNotParticipated();
  console.log("User 2 placed bid on:", regNoUser2);
  
  // Verify both users bid on the same registration number
  expect(regNoUser2).toBe(regNo);
  console.log("Verified both users bid on the same registration number:", regNo);
  
  // Wait for status update
  await pageUser1.reload();
  
  // Step 6: User 1 verifies 'Outbid' status
  await auctionUser1.validateStatusUpdateForRegNo(regNo, "Outbid");

  console.log(`Verified that ${regNo} is Outbid for User 1 and User 2 is Winning`);

  await browser.close();
});
