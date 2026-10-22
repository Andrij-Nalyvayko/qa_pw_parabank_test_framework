import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class AccountOverviewPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountsTable = page.locator('#accountTable');
    this.accountLinks = this.accountsTable.locator('tbody tr td:first-child a');
    this.totalRow = this.accountsTable.locator('tr', { hasText: 'Total' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Accounts Overview page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/overview.htm');
    });
  }

  async getAccountIds() {
    return await this.step('Collect all account ids from the overview table', async () => {
      // allInnerTexts() doesn't auto-wait for the table to render, unlike
      // most other Playwright actions - wait for the first row explicitly
      // so this doesn't race a freshly-opened page.
      await this.accountLinks.first().waitFor();

      return (await this.accountLinks.allInnerTexts()).map(id => id.trim());
    });
  }

  async getFirstAccountId() {
    return await this.step('Get the first account id from the overview table', async () => {
      return (await this.accountLinks.first().innerText()).trim();
    });
  }

  async getAccountBalance(accountId) {
    return await this.step(`Get the balance for account ${accountId}`, async () => {
      const row = this.accountsTable.locator('tr', { hasText: accountId });
      const balanceText = await row.locator('td').nth(1).innerText();

      return parseFloat(balanceText.replace(/[^0-9.-]/g, ''));
    });
  }

  async clickAccount(accountId) {
    return await this.step(`Open account ${accountId} details`, async () => {
      await this.accountsTable.getByRole('link', { name: accountId }).click();
    });
  }

  async assertAccountsOverviewIsVisible() {
    return await this.step('Accounts Overview heading and table are visible', async () => {
      await expect(this.heading).toBeVisible();
      await expect(this.accountsTable).toBeVisible();
    });
  }

  async assertBalanceIs(accountId, expectedBalance) {
    return await this.step(`Balance of account ${accountId} is ${expectedBalance}`, async () => {
      const balance = await this.getAccountBalance(accountId);

      expect(balance).toBeCloseTo(expectedBalance, 2);
    });
  }

  async assertAccountIsListed(accountId) {
    return await this.step(`Account ${accountId} is listed in the overview table`, async () => {
      await expect(this.accountsTable.getByRole('link', { name: accountId })).toBeVisible();
    });
  }

  async assertTotalBalanceIsSumOfAccounts() {
    return await this.step('Total balance equals the sum of all account balances', async () => {
      const ids = await this.getAccountIds();
      const balances = await Promise.all(ids.map(id => this.getAccountBalance(id)));
      const expectedTotal = balances.reduce((sum, balance) => sum + balance, 0);

      const totalText = await this.totalRow.locator('td').nth(1).innerText();
      const actualTotal = parseFloat(totalText.replace(/[^0-9.-]/g, ''));

      expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    });
  }
}
