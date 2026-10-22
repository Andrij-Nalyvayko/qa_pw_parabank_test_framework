import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator('input[name="username"]');
    this.passwordField = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.accountOverview = page.getByRole('heading', { name: 'Accounts Overview' });
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open login page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/index.htm');
    });
  }

  async fillUsernameField(username) {
    return await this.step('Fill the username field', async () => {
      await this.usernameField.fill(username);
    });
  }

  async fillPasswordField(password) {
    return await this.step('Fill the password field', async () => {
      await this.passwordField.fill(password);
    });
  }

  async clickLoginButton() {
    return await this.step('Click the login button', async () => {
      await this.loginButton.click();
    });
  }

  async assertWelcomeMessageIsVisible() {
    return await this.step('Welcome message is visible after login', async () => {
      await expect(this.accountOverview).toBeVisible();
    });
  }

  async assertLoginFormIsVisible() {
    return await this.step('Login form is visible', async () => {
      await expect(this.usernameField).toBeVisible();
      await expect(this.passwordField).toBeVisible();
      await expect(this.loginButton).toBeVisible();
    });
  }

  async assertLoginErrorIsVisible(message) {
    return await this.step(`Assert the "${message}" login error is shown`, async () => {
      await expect(this.errorHeading).toBeVisible();
      await expect(this.page.getByText(message)).toBeVisible();
    });
  }
}
