import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.firstNameField = page.locator('[id="customer\\.firstName"]');
    this.lastNameField = page.locator('[id="customer\\.lastName"]');
    this.addressField = page.locator('[id="customer\\.address\\.street"]');
    this.cityField = page.locator('[id="customer\\.address\\.city"]');
    this.stateField = page.locator('[id="customer\\.address\\.state"]');
    this.zipCodeField = page.locator('[id="customer\\.address\\.zipCode"]');
    this.phoneNumberField = page.locator('[id="customer\\.phoneNumber"]');
    this.ssnField = page.locator('[id="customer\\.ssn"]');
    this.usernameField = page.locator('[id="customer\\.username"]');
    this.passwordField = page.locator('[id="customer\\.password"]');
    this.confirmPasswordField = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.logoOutButton  = page.getByRole('link', { name: 'Log Out' })
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    await this.step('Open the registration page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
    })
  }

  async clickRegisterLink() {
    return await this.step('Click the register link', async () => {
      await this.registerLink.click();
    })
  }

  async fillFirstNameField(firstName) {
    return await this.step('Fill the first name field', async () => {
      await this.firstNameField.fill(firstName);
    })
  }

  async fillLastNameField(lastName) {
    return await this.step('Fill the last name field', async () => {
      await this.lastNameField.fill(lastName);
    })
  }

  async fillAddressField(address) {
    return await this.step('Fill the address field', async () => {
      await this.addressField.fill(address);
    })
  }

  async fillCityField(city) {
    return await this.step('Fill the city field', async () => {
      await this.cityField.fill(city);
    })
  }

  async fillStateField(state) {
    return await this.step(`Fill the State field`, async () => {
      await this.stateField.fill(state);
    })
  }

  async fillZipCodeField(zipCode) {
    return await this.step(`Fill the Zip code field`, async () => {
      await this.zipCodeField.fill(zipCode);
    })
  }

  async fillPhoneNumberField(phoneNumber) {
    return await this.step(`Fill the phone number field`, async () => {
      await this.phoneNumberField.fill(phoneNumber);
    })
  }

  async fillSsnField(ssn) {
    return await this.step(`Fill the ssn field`, async () => {
      await this.ssnField.fill(ssn);
    })
  }

  async fillUsernameField(username) {
    return await this.step(`Fill the username field`, async () => {
      await this.usernameField.fill(username);
    })
  }

  async fillPasswordField(password) {
    return await this.step(`Fill the password field`, async () => {
      await this.passwordField.fill(password);
    })
  }

  async fillConfirmPasswordField(confirmPassword) {
    return await this.step(`Confirn the password`, async () => {
      await this.confirmPasswordField.fill(confirmPassword);
    })
  }

  async clickRegisterButton() {
    return await this.step(`Clicl the regisyer button`, async () => {
      await this.registerButton.click();
    })
  }

  async assertWelcomeMessageIsVisible(username) {
    return await this.step(`Username is visible in welcome message`, async () => {
      const welcomeMessage = this.page.getByRole('heading', { name: `Welcome ${username}` });
      await expect(welcomeMessage).toBeVisible()
    })
  }

  async assertErrorMessageIsVisisble(message) {
    await this.step(`Assert the ${message} error is shown`, async () => {
      await expect(this.page.getByText(message)).toBeVisible()
    })
  }

  // Soft, non-throwing check: does NOT wait, just reports the current state.
  // Used to decide whether a registration attempt needs to be retried
  // (duplicate username, a Cloudflare bot-check page, a slow/broken response
  // from the shared public demo server - any of these leave the welcome
  // heading missing).
  async isWelcomeMessageVisible(username) {
    return await this.step('Check whether the welcome message is shown', async () => {
      return await this.page.getByRole('heading', { name: `Welcome ${username}` }).isVisible();
    })
  }

  async clickLogOut() {
    await this.step(`Click to log out`, async () => {
      await this.logoOutButton.click();
    })  
  }

}
