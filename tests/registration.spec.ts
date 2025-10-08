import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';


    test('complete registration process', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        
        await registrationPage.completeRegistration(
            'AJGPV5662A',       // PAN
            '810411653275',     // Aadhaar
            '1919',             // OTP
            '231801000010350',  // Bank Account
            'SBIN0070656'       // IFSC
             
        );
        await page.pause();
    });
 /* await page.getByRole('textbox', { name: 'Enter PAN Number' }).click();
  await page.getByRole('textbox', { name: 'Enter PAN Number' }).fill('AJGPV5662A');
  await page.getByRole('radio', { name: 'Individual' }).check();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.getByRole('textbox', { name: 'Enter Aadhaar Number' }).click();
  await page.getByRole('textbox', { name: 'Enter Aadhaar Number' }).fill('810411653275');
  await page.getByRole('button', { name: 'Send OTP' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('textbox').first().fill('1');
  await page.getByRole('textbox').nth(1).fill('9');
  await page.getByRole('textbox').nth(2).fill('1');
 await page.getByRole('textbox').nth(3).fill('9');
  //await page.getByRole('textbox').nth(4).fill('9');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Andhra Pradesh', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('div').filter({ hasText: /^Four Wheelers$/ }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('spinbutton', { name: 'Bank Account Number', exact: true }).click({
    modifiers: ['ControlOrMeta'] //
  });
  await page.getByRole('spinbutton', { name: 'Bank Account Number', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Bank Account Number', exact: true }).fill('231801000010350');
  await page.getByRole('spinbutton', { name: 'Confirm Bank Account Number' }).click();
  await page.getByRole('spinbutton', { name: 'Confirm Bank Account Number' }).fill('231801000010350');
  await page.getByRole('textbox', { name: 'IFSC' }).click();
  await page.getByRole('textbox', { name: 'IFSC' }).fill('SBIN0070656');
  await page.getByRole('button', { name: 'Confirm' }).click();
});
*/