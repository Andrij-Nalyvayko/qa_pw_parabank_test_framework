import { testStep, expect } from '../../../../common/helpers/pwHelpers';

// The left-hand "Account Services" menu that is present on every page once
// a customer is logged in. Centralised here so every logged-in-user page
// object/test can navigate without duplicating these locators.
export class NavigationMenu {
  constructor(page) {
    this.page = page;
    this.panel = page.locator('#leftPanel');
    this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
    this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview' });
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
    this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
    this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });
    this.updateContactInfoLink = page.getByRole('link', { name: 'Update Contact Info' });
    this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async clickLogOut() {
    return await this.step('Click the Log Out link', async () => {
      await this.logOutLink.click();
    });
  }

  async assertMenuIsVisible() {
    return await this.step('Account Services menu is visible', async () => {
      await expect(this.panel).toBeVisible();
      await expect(this.logOutLink).toBeVisible();
    });
  }

  async assertMenuIsNotVisible() {
    return await this.step('Account Services menu is not visible (user is logged out)', async () => {
      await expect(this.logOutLink).toBeHidden();
    });
  }
}
