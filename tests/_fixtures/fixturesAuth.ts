import { test as base } from '@playwright/test';
import { RegisterPage } from '../../src/ui/pages/auth/registerUser/RegisterPage';
import { generateUserData } from '../../src/common/testData/generateUserData';

export const test = base.extend<{
  registerPage: RegisterPage;
  registeredUser: ReturnType<typeof generateUserData>;
}>({
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);

    await use(registerPage);
  },

  registeredUser: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    let user = generateUserData();

    // ParaBank is a shared public demo server (Cloudflare bot-check, an
    // occasional "username already exists" for a brand-new name, a slow/
    // broken response under load) so a single registration attempt can fail
    // for reasons that have nothing to do with our test data. Retry a few
    // times with fresh data before giving up.
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await registerPage.open();
      await registerPage.clickRegisterLink();
      await registerPage.fillFirstNameField(user.firstName);
      await registerPage.fillLastNameField(user.lastName);
      await registerPage.fillAddressField(user.address);
      await registerPage.fillCityField(user.city);
      await registerPage.fillStateField(user.state);
      await registerPage.fillZipCodeField(user.zipCode);
      await registerPage.fillPhoneNumberField(user.phoneNumber);
      await registerPage.fillSsnField(user.ssn);
      await registerPage.fillUsernameField(user.username);
      await registerPage.fillPasswordField(user.password);
      await registerPage.fillConfirmPasswordField(user.password);
      await registerPage.clickRegisterButton();

      if (await registerPage.isWelcomeMessageVisible(user.username)) {
        break;
      }

      if (attempt === maxAttempts) {
        // Final attempt: fail with a proper assertion error instead of
        // silently swallowing the failure.
        await registerPage.assertWelcomeMessageIsVisible(user.username);
      }

      user = generateUserData();
    }

    await use(user);
  },
})
