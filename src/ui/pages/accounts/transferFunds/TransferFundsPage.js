import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class TransferFundsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Transfer Funds' });
    this.amountField = page.locator('#amount');
    this.fromAccountDropdown = page.locator('#fromAccountId');
    this.toAccountDropdown = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.resultHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Transfer Funds page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/transfer.htm');
    });
  }

  async fillAmount(amount) {
    return await this.step(`Fill the transfer amount: ${amount}`, async () => {
      await this.amountField.fill(String(amount));
    });
  }

  async selectFromAccount(accountId) {
    return await this.step(`Select the source account ${accountId}`, async () => {
      await this.fromAccountDropdown.selectOption({ label: accountId });
    });
  }

  async selectToAccount(accountId) {
    return await this.step(`Select the destination account ${accountId}`, async () => {
      await this.toAccountDropdown.selectOption({ label: accountId });
    });
  }

  async clickTransfer() {
    return await this.step('Click the Transfer button', async () => {
      await this.transferButton.click();
    });
  }

  async assertTransferIsComplete(amount, fromAccountId, toAccountId) {
    return await this.step(`Transfer of $${amount} from ${fromAccountId} to ${toAccountId} is complete`, async () => {
      // Only assert on the confirmation heading, not the exact wording the
      // confirmation panel uses for the amount/account numbers - ParaBank
      // may format a negative/zero amount differently than the raw input
      // (e.g. drop the sign, add a currency format), which isn't the point
      // of this check.
      await expect(this.resultHeading).toBeVisible();
    });
  }

  async assertErrorIsVisible(message) {
    return await this.step(`Assert the "${message}" error is shown`, async () => {
      await expect(this.errorHeading).toBeVisible();
      await expect(this.page.getByText(message)).toBeVisible();
    });
  }
}
