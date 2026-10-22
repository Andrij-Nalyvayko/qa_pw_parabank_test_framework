import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class AccountDetailsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Account Details' });
    this.accountIdLabel = page.locator('#accountId');
    this.balanceLabel = page.locator('#balance');
    this.availableBalanceLabel = page.locator('#availableBalance');
    this.monthDropdown = page.locator('#month');
    this.transactionTypeDropdown = page.locator('#transactionType');
    this.goButton = page.getByRole('button', { name: 'Go' });
    this.transactionsTable = page.locator('#transactionTable');
    this.transactionRows = this.transactionsTable.locator('tbody tr');
    this.noTransactionsMessage = page.getByText('No transactions found.');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open(accountId) {
    return await this.step(`Open the Account Details page for account ${accountId}`, async () => {
      await this.page.goto(`https://parabank.parasoft.com/parabank/activity.htm?id=${accountId}`);
    });
  }

  async filterByMonth(month) {
    return await this.step(`Filter account activity by month: ${month}`, async () => {
      await this.monthDropdown.selectOption({ label: month });
    });
  }

  async filterByTransactionType(type) {
    return await this.step(`Filter account activity by transaction type: ${type}`, async () => {
      await this.transactionTypeDropdown.selectOption({ label: type });
    });
  }

  async clickGo() {
    return await this.step('Click the Go button to apply the filter', async () => {
      await this.goButton.click();
      // .count() (used by getTransactionCount/assertNoTransactionsFound right
      // after this) doesn't auto-wait like most Playwright actions do, so
      // make sure the filtered page has actually loaded first.
      await expect(this.heading).toBeVisible();
    });
  }

  async assertAccountDetailsAreVisible(accountId) {
    return await this.step(`Account details for account ${accountId} are visible`, async () => {
      await expect(this.heading).toBeVisible();
      await expect(this.accountIdLabel).toHaveText(accountId);
    });
  }

  async assertTransactionsAreVisible() {
    return await this.step('At least one transaction is listed', async () => {
      await expect(this.transactionRows.first()).toBeVisible();
    });
  }

  async getTransactionCount() {
    return await this.step('Count the listed transactions', async () => {
      return await this.transactionRows.count();
    });
  }

  async assertNoTransactionsFound() {
    return await this.step('No transactions match the applied filter', async () => {
      const rowsCount = await this.transactionRows.count();

      expect(rowsCount).toBe(0);
    });
  }
}
