import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export const ACCOUNT_TYPE = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
};

export class OpenNewAccountPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Open New Account' });
    this.accountTypeDropdown = page.locator('#type');
    this.fromAccountDropdown = page.locator('#fromAccountId');
    this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.resultHeading = page.getByRole('heading', { name: 'Account Opened!' });
    this.newAccountIdLink = page.locator('#newAccountId');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Open New Account page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/openaccount.htm');
    });
  }

  async selectAccountType(type) {
    return await this.step(`Select the ${type} account type`, async () => {
      await this.accountTypeDropdown.selectOption({ label: type });
    });
  }

  async selectFromAccount(accountId) {
    return await this.step(`Select the funding account ${accountId}`, async () => {
      await this.fromAccountDropdown.selectOption({ label: accountId });
    });
  }

  async clickOpenNewAccount() {
    return await this.step('Click the Open New Account button', async () => {
      await this.openAccountButton.click();
    });
  }

  async getNewAccountId() {
    return await this.step('Get the newly opened account id', async () => {
      await expect(this.newAccountIdLink).toBeVisible();

      return (await this.newAccountIdLink.innerText()).trim();
    });
  }

  async assertNewAccountIsOpened() {
    return await this.step('A new account has been opened', async () => {
      await expect(this.resultHeading).toBeVisible();
      await expect(this.newAccountIdLink).toBeVisible();
    });
  }
}
