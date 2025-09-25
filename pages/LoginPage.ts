import { Page, Locator, expect } from "@playwright/test";
import { testConfig } from '../config/testConfig';

/**
 * Page Object Model for Login functionality
 */
export class LoginPage {
    private readonly page: Page;
    private readonly userName: Locator;
    private readonly password: Locator;
    private readonly loginButton: Locator;
    private readonly loginSuccessMsg: Locator;

    /**
     * Initialize login page elements
     * @param page Playwright page object
     */
    constructor(page: Page) {
        this.page = page;
        this.userName = page.getByRole("textbox", { name: "Enter User ID" });
        this.password = page.getByRole("textbox", { name: "Enter Password" });
        this.loginButton = page.getByRole("button", { name: "Login" });
        this.loginSuccessMsg = page.getByText("Login Success");
    }

    /**
     * Navigate to the login page
     */
    async goto(): Promise<void> {
        try {
            await this.page.goto(testConfig.baseURL);
            console.log("Navigated to login page");
        } catch (error) {
            console.error("Failed to navigate to login page:", error.message);
            throw error;
        }
    }

    /**
     * Perform login with provided credentials
     * @param username User ID
     * @param password Password
     */
    async login(username: string, password: string): Promise<void> {
        try {
            // Wait for and fill username
            await this.userName.waitFor({ state: 'visible', timeout: 5000 });
            await this.userName.fill(username);
            console.log('Username entered:', username);

            // Wait for and fill password
            await this.password.waitFor({ state: 'visible', timeout: 5000 });
            await this.password.fill(password);
            console.log(`Password entered: ${"*".repeat(password.length)}`);

            // Click login button
            await this.loginButton.waitFor({ state: 'visible', timeout: 5000 });
            await this.loginButton.click();
            console.log(" Login button clicked");

            // Verify login success
            await expect(this.loginSuccessMsg).toBeVisible({ timeout: 10000 });
            
            // Take screenshot on successful login
            await this.page.screenshot({ 
                path: 'Screenshots/loginSuccess.png',
                fullPage: false 
            });
            console.log("Login successful");
        } catch (error) {
            console.error("Login failed:", error.message);
            // Take screenshot on failure
            await this.page.screenshot({ 
                path: 'Screenshots/loginFailure.png',
                fullPage: true 
            });
            throw error;
        }
    }

    /**
     * Verify if user is logged in
     * @returns Promise<boolean>
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            await this.loginSuccessMsg.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }


}
