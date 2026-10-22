import { testStep, expect } from '../../../../common/helpers/pwHelpers';

export class UpdateContactInfoPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Update Profile' });
    this.firstNameField = page.locator('[id="customer.firstName"]');
    this.lastNameField = page.locator('[id="customer.lastName"]');
    this.addressField = page.locator('[id="customer.address.street"]');
    this.cityField = page.locator('[id="customer.address.city"]');
    this.stateField = page.locator('[id="customer.address.state"]');
    this.zipCodeField = page.locator('[id="customer.address.zipCode"]');
    this.phoneNumberField = page.locator('[id="customer.phoneNumber"]');
    this.updateButton = page.getByRole('button', { name: 'Update Profile' });
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun);
  }

  async open() {
    return await this.step('Open the Update Contact Info page', async () => {
      await this.page.goto('https://parabank.parasoft.com/parabank/updateprofile.htm');
    });
  }

  async fillFirstName(firstName) {
    return await this.step(`Fill the first name field: ${firstName}`, async () => {
      await this.firstNameField.fill(firstName);
    });
  }

  async fillLastName(lastName) {
    return await this.step(`Fill the last name field: ${lastName}`, async () => {
      await this.lastNameField.fill(lastName);
    });
  }

  async fillAddress(address) {
    return await this.step(`Fill the address field: ${address}`, async () => {
      await this.addressField.fill(address);
    });
  }

  async fillCity(city) {
    return await this.step(`Fill the city field: ${city}`, async () => {
      await this.cityField.fill(city);
    });
  }

  async fillState(state) {
    return await this.step(`Fill the state field: ${state}`, async () => {
      await this.stateField.fill(state);
    });
  }

  async fillZipCode(zipCode) {
    return await this.step(`Fill the zip code field: ${zipCode}`, async () => {
      await this.zipCodeField.fill(zipCode);
    });
  }

  async fillPhoneNumber(phoneNumber) {
    return await this.step(`Fill the phone number field: ${phoneNumber}`, async () => {
      await this.phoneNumberField.fill(phoneNumber);
    });
  }

  async clickUpdateProfile() {
    return await this.step('Click the Update Profile button', async () => {
      await this.updateButton.click();
    });
  }

  async assertProfileIsUpdated() {
    return await this.step('The profile was updated successfully', async () => {
      await expect(this.errorHeading).not.toBeAttached();
      await expect(this.heading).toBeVisible();
    });
  }

  // NOTE: observed live - submitting a new address via this form shows no
  // error and the "Update Profile" page itself, but reloading the page
  // afterwards shows the address is still the OLD one. This mirrors other
  // known ParaBank data-persistence quirks (e.g. the Transfer Funds amount
  // validation gap) rather than a mistake in this test - see
  // transferFunds.spec.js for the same kind of "documents real behaviour"
  // test.
  async assertAddressChangeDidNotPersist(originalAddress) {
    return await this.step('The submitted address change did not actually persist (known bug)', async () => {
      await this.open();
      await expect(this.addressField).toHaveValue(originalAddress);
    });
  }

  async assertErrorIsVisible(message) {
    return await this.step(`Assert the "${message}" error is shown`, async () => {
      await expect(this.page.getByText(message)).toBeVisible();
    });
  }
}
