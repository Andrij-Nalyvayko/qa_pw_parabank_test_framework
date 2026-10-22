import { test } from '../../_fixtures/fixtures';
import { CustomerLookUp } from '../../../src/ui/pages/auth/forgotLoginInfo/CustomerLookUp';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import {
  CUSTOMER_NOT_FOUND,
  EMPTY_FIRST_NAME,
  EMPTY_LAST_NAME,
  EMPTY_ADRESS,
  EMPTY_CITY,
  EMPTY_STATE,
  EMPTY_ZIP_CODE,
  EMPTY_SSN,
} from '../../../src/ui/pages/constants/authErrorMessage';

test('Find a registered user in the bank database', async ({ pages, registeredUser }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Authentication', story: 'Forgot Login Info' });

  const lookUpPage = new CustomerLookUp(pages[0]);
  const user = registeredUser;

  await lookUpPage.open();
  await lookUpPage.fillFirstNameField(user.firstName);
  await lookUpPage.fillLastNameField(user.lastName);
  await lookUpPage.fillAddressField(user.address);
  await lookUpPage.fillCityField(user.city);
  await lookUpPage.fillStateField(user.state);
  await lookUpPage.fillZipField(user.zipCode);
  await lookUpPage.fillSsnField(user.ssn);
  await lookUpPage.clickFindCustomerButton();
  await lookUpPage.assertCustomerFound(user.username);
});

test('Looking up a customer with data that matches no account fails', async ({ pages }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Authentication', story: 'Forgot Login Info' });

  const lookUpPage = new CustomerLookUp(pages[0]);

  await lookUpPage.open();
  await lookUpPage.fillFirstNameField('Nobody');
  await lookUpPage.fillLastNameField('Nowhere');
  await lookUpPage.fillAddressField('0 Nowhere St');
  await lookUpPage.fillCityField('Nowhere');
  await lookUpPage.fillStateField('ZZ');
  await lookUpPage.fillZipField('00000');
  await lookUpPage.fillSsnField('000000000');
  await lookUpPage.clickFindCustomerButton();
  await lookUpPage.assertCustomerNotFoundErrorIsVisible(CUSTOMER_NOT_FOUND);
});

const requiredFieldCases = [
  { field: 'firstName', value: '', title: 'Empty first name field', message: EMPTY_FIRST_NAME },
  { field: 'lastName', value: '', title: 'Empty last name field', message: EMPTY_LAST_NAME },
  { field: 'address', value: '', title: 'Empty address field', message: EMPTY_ADRESS },
  { field: 'city', value: '', title: 'Empty city field', message: EMPTY_CITY },
  { field: 'state', value: '', title: 'Empty state field', message: EMPTY_STATE },
  { field: 'zipCode', value: '', title: 'Empty zip code field', message: EMPTY_ZIP_CODE },
  { field: 'ssn', value: '', title: 'Empty ssn field', message: EMPTY_SSN },
];

test.describe('Customer look up validation errors', () => {
  requiredFieldCases.forEach(({ field, title, message }) => {
    test(`Look up a customer with ${title}`, async ({ pages }) => {
      await tagTest({ severity: Severity.MINOR, feature: 'Authentication', story: 'Forgot Login Info' });

      const data = {
        firstName: 'Nobody',
        lastName: 'Nowhere',
        address: '0 Nowhere St',
        city: 'Nowhere',
        state: 'ZZ',
        zipCode: '00000',
        ssn: '000000000',
        [field]: '',
      };
      const lookUpPage = new CustomerLookUp(pages[0]);

      await lookUpPage.open();
      await lookUpPage.fillFirstNameField(data.firstName);
      await lookUpPage.fillLastNameField(data.lastName);
      await lookUpPage.fillAddressField(data.address);
      await lookUpPage.fillCityField(data.city);
      await lookUpPage.fillStateField(data.state);
      await lookUpPage.fillZipField(data.zipCode);
      await lookUpPage.fillSsnField(data.ssn);
      await lookUpPage.clickFindCustomerButton();
      await lookUpPage.assertFieldErrorIsVisible(message);
    });
  });
});
