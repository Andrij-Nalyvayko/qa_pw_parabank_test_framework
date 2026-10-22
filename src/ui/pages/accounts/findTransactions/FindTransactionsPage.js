import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class FindTransactionsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Find Transactions' });
    this.accountDropdown = page.locator('#accountId');
    this.transactionIdField = page.locator('[id="criteria.transactionId"]');
    this.amountField = page.locator('[id="criteria.amount"]');
    this.onDateField = page.locator('[id="criteria.onDate"]');
    this.fromDateField = page.locator('[id="criteria.fromDate"]');
    this.toDateField = page.locator('[id="criteria.toDate"]');
    this.transactionsTable = page.locator('#transactionTable');
    this.transactionRows = this.transactionsTable.locator('tbody tr');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Find Transactions page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/findtrans.htm');
    });
  }

  async selectAccount(accountId) {
    return await this.step(`Select account ${accountId}`, async () => {
      await this.accountDropdown.selectOption({ label: accountId });
    });
  }

  // Every search criteria field (transaction id / amount / date / date range)
  // is submitted through its own small form, each with a "Find Transactions"
  // button right next to it - so we locate the button relative to the field
  // the caller just filled in, instead of relying on a single shared button.
  async submitNearestFindButton(field) {
    return await this.step('Click the nearest "Find Transactions" button', async () => {
      await field
        .locator('xpath=ancestor::form[1]')
        .getByRole('button', { name: 'Find Transactions' })
        .click();
    });
  }

  async findByTransactionId(transactionId) {
    return await this.step(`Find a transaction by id: ${transactionId}`, async () => {
      await this.transactionIdField.fill(String(transactionId));
      await this.submitNearestFindButton(this.transactionIdField);
    });
  }

  async findByAmount(amount) {
    return await this.step(`Find transactions by amount: ${amount}`, async () => {
      await this.amountField.fill(String(amount));
      await this.submitNearestFindButton(this.amountField);
    });
  }

  async findByDate(date) {
    return await this.step(`Find transactions on date: ${date}`, async () => {
      await this.onDateField.fill(date);
      await this.submitNearestFindButton(this.onDateField);
    });
  }

  async findByDateRange(fromDate, toDate) {
    return await this.step(`Find transactions between ${fromDate} and ${toDate}`, async () => {
      await this.fromDateField.fill(fromDate);
      await this.toDateField.fill(toDate);
      await this.submitNearestFindButton(this.fromDateField);
    });
  }

  async assertTransactionIsFound() {
    return await this.step('At least one transaction matches the search criteria', async () => {
      await expect(this.transactionRows.first()).toBeVisible();
    });
  }

  async assertTransactionNotFound() {
    return await this.step('No transaction matches the search criteria', async () => {
      await expect(this.transactionRows).toHaveCount(0);
    });
  }
}
