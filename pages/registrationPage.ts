import { Page, Locator, expect } from "@playwright/test";
import { testConfig } from "../config/testConfig";

export class RegistrationPage {
  private static names = [
    "Ravi", "Kiran", "Priya", "Anita", "Vijay",
    "Suresh", "Neha", "Manoj", "Divya", "Arjun"
  ];
  private static nameIndex = 0;

  private page: Page;

  // Define locators for the registration page elements
  private readonly nameInput: Locator;
  private readonly mobileInput: Locator;
  private readonly panInput: Locator;
  private readonly individualRadio: Locator;
  private readonly proceedButton: Locator;
  private readonly aadhaarInput: Locator;
  private readonly sendOtpButton: Locator;
  private readonly otpInputs: Locator[]; 
  private readonly submitButton: Locator;
  private readonly stateSelection: Locator;
  private readonly continueButton: Locator;
  private readonly vehicleTypeSelection: Locator;
  private readonly bankAccountInput: Locator;
  private readonly confirmBankAccountInput: Locator;
  private readonly ifscInput: Locator;
  private readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.getByRole('textbox', { name: 'Enter Name as per PAN card' });
    this.mobileInput = page.getByRole('textbox', { name: 'Enter Mobile Number' });
    this.panInput = page.getByRole('textbox', { name: 'Enter PAN Number' });
    this.individualRadio = page.getByRole('radio', { name: 'Individual' });
    this.proceedButton = page.getByRole('button', { name: 'Proceed' });

    this.aadhaarInput = page.getByRole('textbox', { name: 'Enter Aadhaar Number' });
    this.sendOtpButton = page.getByRole('button', { name: 'Send OTP' });

    this.otpInputs = [
      page.getByRole('textbox').first(),
      page.getByRole('textbox').nth(1),
      page.getByRole('textbox').nth(2),
      page.getByRole('textbox').nth(3)
    ];

    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.stateSelection = page.getByText('Andhra Pradesh', { exact: true });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.vehicleTypeSelection = page.locator('div').filter({ hasText: /^Four Wheelers$/ });
    this.bankAccountInput = page.getByRole('spinbutton', { name: 'Bank Account Number', exact: true });
    this.confirmBankAccountInput = page.getByRole('spinbutton', { name: 'Confirm Bank Account Number' });
    this.ifscInput = page.getByRole('textbox', { name: 'IFSC' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
  }

  /** Generate next name from a fixed 10-name list */
  private generateUniqueName(): string {
    const name = RegistrationPage.names[RegistrationPage.nameIndex];
    RegistrationPage.nameIndex = (RegistrationPage.nameIndex + 1) % RegistrationPage.names.length;
    return name;
  }

  /** Generate random 10-digit mobile number (starts with 9) */
  private generateUniqueMobile(): string {
    const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
    return `9${randomNum}`;
  }

  async navigateToRegistration() {
    await this.page.goto(testConfig.baseURL);
    await this.page.getByRole('link', { name: 'Register' }).click();
  }

  async fillBasicDetails(name: string, mobile: string, pan: string) {
    await console.log(`Filling name: ${name}`);
    await this.nameInput.fill(name);
    await console.log(`Filling mobile number: ${mobile}`);
    await this.mobileInput.fill(mobile);
    await this.panInput.fill(pan);
    await this.individualRadio.check();
    await this.proceedButton.click();
  }

  async fillAadhaarAndOtp(aadhaar: string, otp: string) {
    await this.aadhaarInput.fill(aadhaar);
    await this.sendOtpButton.click();
    await this.page.waitForTimeout(3000); // wait for OTP simulation

    const otpDigits = otp.split('');
    for (let i = 0; i < 4; i++) {
      await this.otpInputs[i].fill(otpDigits[i]);
    }

    await this.submitButton.click();
  }

  async selectStateAndVehicle() {
    await this.stateSelection.click();
    await this.continueButton.click();
    await this.vehicleTypeSelection.click();
    await this.continueButton.click();
  }

  async fillBankDetails(accountNumber: string, ifscCode: string) {
    await this.bankAccountInput.fill(accountNumber);
    await this.confirmBankAccountInput.fill(accountNumber);
    await this.ifscInput.fill(ifscCode);
    await this.confirmButton.click();
  }

  async completeRegistration(
    pan: string,
    aadhaar: string,
    otp: string,
    accountNumber: string,
    ifscCode: string
  ) {
    const uniqueName = this.generateUniqueName();
    const uniqueMobile = this.generateUniqueMobile();

    console.log(`Registering with unique name: ${uniqueName}`);
    console.log(`Registering with unique mobile: ${uniqueMobile}`);

    await this.navigateToRegistration();
    await this.fillBasicDetails(uniqueName, uniqueMobile, pan);
    await this.fillAadhaarAndOtp(aadhaar, otp);
    await this.selectStateAndVehicle();
    await this.fillBankDetails(accountNumber, ifscCode);
  }
}
