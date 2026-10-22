import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class RequestLoanPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Apply for a Loan' });
    this.amountField = page.locator('#amount');
    this.downPaymentField = page.locator('#downPayment');
    this.fromAccountDropdown = page.locator('#fromAccountId');
    this.applyButton = page.getByRole('button', { name: 'Apply Now' });
    this.approvedPanel = page.locator('#loanRequestApproved');
    this.deniedPanel = page.locator('#loanRequestDenied');
    this.newAccountIdLink = page.locator('#newAccountId');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Request Loan page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/requestloan.htm');
    });
  }

  async fillAmount(amount) {
    return await this.step(`Fill the loan amount: ${amount}`, async () => {
      await this.amountField.fill(String(amount));
    });
  }

  async fillDownPayment(downPayment) {
    return await this.step(`Fill the down payment: ${downPayment}`, async () => {
      await this.downPaymentField.fill(String(downPayment));
    });
  }

  async selectFromAccount(accountId) {
    return await this.step(`Select the funding account ${accountId}`, async () => {
      await this.fromAccountDropdown.selectOption({ label: accountId });
    });
  }

  async clickApplyNow() {
    return await this.step('Click the Apply Now button', async () => {
      await this.applyButton.click();
    });
  }

  async assertLoanRequestIsProcessed() {
    return await this.step('The loan request has been processed (approved or denied)', async () => {
      await expect(this.approvedPanel.or(this.deniedPanel)).toBeVisible({ timeout: 15000 });
    });
  }

  async isLoanApproved() {
    return await this.step('Check whether the loan request was approved', async () => {
      return await this.approvedPanel.isVisible();
    });
  }

  async getNewLoanAccountId() {
    return await this.step('Get the newly opened loan account id', async () => {
      return (await this.newAccountIdLink.innerText()).trim();
    });
  }

  // If (and only if) the loan was approved, ParaBank opens a new loan
  // account - confirm it shows up in the Accounts Overview.
  async assertNewLoanAccountIsListedWhenApproved(accountOverviewPage) {
    return await this.step('The new loan account is listed when the loan is approved', async () => {
      if (!(await this.isLoanApproved())) {
        return;
      }

      const newLoanAccountId = await this.getNewLoanAccountId();

      await accountOverviewPage.open();
      await accountOverviewPage.assertAccountIsListed(newLoanAccountId);
    });
  }
}
