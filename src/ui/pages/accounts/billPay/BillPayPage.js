import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class BillPayPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Bill Payment Service' });
    this.payeeNameField = page.locator('[id="payee.name"]');
    this.addressField = page.locator('[id="payee.address.street"]');
    this.cityField = page.locator('[id="payee.address.city"]');
    this.stateField = page.locator('[id="payee.address.state"]');
    this.zipCodeField = page.locator('[id="payee.address.zipCode"]');
    this.phoneNumberField = page.locator('[id="payee.phoneNumber"]');
    this.accountNumberField = page.locator('[id="payee.accountNumber"]');
    this.verifyAccountField = page.locator('#verifyAccount');
    this.amountField = page.locator('#amount');
    this.fromAccountDropdown = page.locator('#fromAccountId');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
    this.resultHeading = page.getByRole('heading', { name: 'Bill Payment Complete' });
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Bill Pay page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/billpay.htm');
    });
  }

  async fillPayeeName(name) {
    return await this.step(`Fill the payee name: ${name}`, async () => {
      await this.payeeNameField.fill(name);
    });
  }

  async fillAddress(address) {
    return await this.step(`Fill the payee address: ${address}`, async () => {
      await this.addressField.fill(address);
    });
  }

  async fillCity(city) {
    return await this.step(`Fill the payee city: ${city}`, async () => {
      await this.cityField.fill(city);
    });
  }

  async fillState(state) {
    return await this.step(`Fill the payee state: ${state}`, async () => {
      await this.stateField.fill(state);
    });
  }

  async fillZipCode(zipCode) {
    return await this.step(`Fill the payee zip code: ${zipCode}`, async () => {
      await this.zipCodeField.fill(zipCode);
    });
  }

  async fillPhoneNumber(phoneNumber) {
    return await this.step(`Fill the payee phone number: ${phoneNumber}`, async () => {
      await this.phoneNumberField.fill(phoneNumber);
    });
  }

  async fillAccountNumber(accountNumber) {
    return await this.step(`Fill the payee account number: ${accountNumber}`, async () => {
      await this.accountNumberField.fill(accountNumber);
    });
  }

  async fillVerifyAccount(accountNumber) {
    return await this.step(`Fill the verify account number: ${accountNumber}`, async () => {
      await this.verifyAccountField.fill(accountNumber);
    });
  }

  async fillAmount(amount) {
    return await this.step(`Fill the payment amount: ${amount}`, async () => {
      await this.amountField.fill(String(amount));
    });
  }

  async selectFromAccount(accountId) {
    return await this.step(`Select the source account ${accountId}`, async () => {
      await this.fromAccountDropdown.selectOption({ label: accountId });
    });
  }

  async clickSendPayment() {
    return await this.step('Click the Send Payment button', async () => {
      await this.sendPaymentButton.click();
    });
  }

  async payBill({ payeeName, address, city, state, zipCode, phoneNumber, accountNumber, verifyAccount, amount, fromAccountId }) {
    return await this.step('Fill out and submit the bill payment form', async () => {
      await this.fillPayeeName(payeeName);
      await this.fillAddress(address);
      await this.fillCity(city);
      await this.fillState(state);
      await this.fillZipCode(zipCode);
      await this.fillPhoneNumber(phoneNumber);
      await this.fillAccountNumber(accountNumber);
      await this.fillVerifyAccount(verifyAccount);
      await this.fillAmount(amount);
      await this.selectFromAccount(fromAccountId);
      await this.clickSendPayment();
    });
  }

  async assertPaymentIsComplete() {
    return await this.step('Bill payment completed successfully', async () => {
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
