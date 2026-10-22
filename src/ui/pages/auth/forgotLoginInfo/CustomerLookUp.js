import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class CustomerLookUp {
  constructor(page) {
    this.page = page;
    this.lookUpLink = page.getByRole('link', { name: 'Forgot login info?' });
    this.firstNameField = page.locator('#firstName');
    this.lastNameField = page.locator('#lastName');
    this.addressField = page.locator('[id="address\\.street"]');
    this.cityField = page.locator('[id="address\\.city"]');
    this.stateField = page.locator('[id="address\\.state"]');
    this.zipCodeField = page.locator('[id="address\\.zipCode"]');
    this.ssnField = page.locator('#ssn');
    this.lookUpButton = page.getByRole('button', { name: 'Find My Login Info' });
    this.successMessage = page.getByText('Your login information was located successfully');
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step(`Open the look up page`, async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/lookup.htm');
    })
  }

  async clickLookUpLink() {
    return await this.step(`Click the Forgot login info link`, async () => {
      await this.lookUpLink.click();
    })
  }

  async fillFirstNameField(firstName) {
    return await this.step(`Fill the first name field`, async () => {
      await this.firstNameField.fill(firstName);
    })
  }

  async fillLastNameField(lastName) {
    return await this.step(`Fill the last name field`, async () => {
      await this.lastNameField.fill(lastName);
    })
  }

  async fillAddressField(address) {
    return await this.step(`Fill the address field`, async () => {
      await this.addressField.fill(address);
    })
  }

  async fillCityField(city) {
    return await this.step(`Fill the city field`, async () => {
      await this.cityField.fill(city);
    })
  }

  async fillStateField(state) {
    return await this.step(`Fill the state field`, async () => {
      await this.stateField.fill(state);
    })
  }

  async fillZipField(zipCode) {
    return await this.step(`Fill the zip code field`, async () => {
      await this.zipCodeField.fill(zipCode);
    })
  }

  async fillSsnField(ssn) {
    return await this.step(`Fill the ssn field`, async () => {
      await this.ssnField.fill(ssn);
    })
  }

  async clickFindCustomerButton() {
    return await this.step(`Click the Find My Login Info button`, async () => {
      await this.lookUpButton.click();
    })
  }

  async assertCustomerFound(username) {
    return await this.step(`Assert the user was found in the bank database`, async () => {
      await expect(this.successMessage).toBeVisible();
      await expect(this.page.getByText(username)).toBeVisible();
    })
  }

  // Covers the inline, per-field "is required." validation messages - no
  // "Error!" banner is shown for those, only the field hint text itself.
  async assertFieldErrorIsVisible(message) {
    return await this.step(`Assert the "${message}" field error is shown`, async () => {
      await expect(this.page.getByText(message)).toBeVisible();
    })
  }

  // Covers the top-level "Error!" banner shown when the submitted data
  // doesn't match any customer in the database.
  async assertCustomerNotFoundErrorIsVisible(message) {
    return await this.step(`Assert the "${message}" error is shown`, async () => {
      await expect(this.errorHeading).toBeVisible();
      await expect(this.page.getByText(message)).toBeVisible();
    })
  }
}
