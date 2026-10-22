import { test } from '../../_fixtures/fixtures';
import { generateUserData } from '../../../src/common/testData/generateUserData';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import {
  EMPTY_FIRST_NAME,
  EMPTY_LAST_NAME,
  EMPTY_ADRESS,
  EMPTY_CITY,
  EMPTY_STATE,
  EMPTY_ZIP_CODE,
} from '../../../src/ui/pages/constants/authErrorMessage';

test('A customer can update their contact information', async ({ updateContactInfoPage }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Customer Profile', story: 'Update Contact Info' });

  const newDetails = generateUserData();

  await updateContactInfoPage.fillAddress(newDetails.address);
  await updateContactInfoPage.fillCity(newDetails.city);
  await updateContactInfoPage.fillState(newDetails.state);
  await updateContactInfoPage.fillZipCode(newDetails.zipCode);
  await updateContactInfoPage.fillPhoneNumber(newDetails.phoneNumber);
  await updateContactInfoPage.clickUpdateProfile();
  await updateContactInfoPage.assertProfileIsUpdated();
});

test('A submitted address change does not actually persist (known ParaBank bug)', async ({
  loggedInUser,
  updateContactInfoPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Customer Profile', story: 'Update Contact Info' });

  const newAddress = generateUserData().address;

  await updateContactInfoPage.fillAddress(newAddress);
  await updateContactInfoPage.clickUpdateProfile();
  await updateContactInfoPage.assertProfileIsUpdated();
  await updateContactInfoPage.assertAddressChangeDidNotPersist(loggedInUser.address);
});

const requiredFieldCases = [
  { title: 'Empty first name field', fill: page => page.fillFirstName(''), message: EMPTY_FIRST_NAME },
  { title: 'Empty last name field', fill: page => page.fillLastName(''), message: EMPTY_LAST_NAME },
  { title: 'Empty address field', fill: page => page.fillAddress(''), message: EMPTY_ADRESS },
  { title: 'Empty city field', fill: page => page.fillCity(''), message: EMPTY_CITY },
  { title: 'Empty state field', fill: page => page.fillState(''), message: EMPTY_STATE },
  { title: 'Empty zip code field', fill: page => page.fillZipCode(''), message: EMPTY_ZIP_CODE },
];

test.describe('Update Contact Info validation errors', () => {
  requiredFieldCases.forEach(({ title, fill, message }) => {
    test(`Updating the profile with ${title.toLowerCase()}`, async ({ updateContactInfoPage }) => {
      await tagTest({ severity: Severity.MINOR, feature: 'Customer Profile', story: 'Update Contact Info' });

      await fill(updateContactInfoPage);
      await updateContactInfoPage.clickUpdateProfile();
      await updateContactInfoPage.assertErrorIsVisible(message);
    });
  });
});
