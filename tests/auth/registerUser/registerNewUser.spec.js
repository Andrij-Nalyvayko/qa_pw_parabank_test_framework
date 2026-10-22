import { test } from '../../_fixtures/fixtures';
import { generateUserData } from '../../../src/common/testData/generateUserData';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import {
  EMPTY_FIRST_NAME, EMPTY_LAST_NAME, EMPTY_ADRESS, EMPTY_CITY,
  EMPTY_STATE, EMPTY_ZIP_CODE, EMPTY_SSN, EMPTY_USERNAME,
  EMPTY_PASSWORD, COMFIRMATION_PASSSORD
} from '../../../src/ui/pages/constants/authErrorMessage';


const user = generateUserData();


test(`Register a new user in bank application`, async ({ registerPage }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Authentication', story: 'Registration' });

  await registerPage.open();
  await registerPage.clickRegisterLink();

  await registerPage.fillFirstNameField(user.firstName);
  await registerPage.fillLastNameField(user.lastName);
  await registerPage.fillAddressField(user.address);
  await registerPage.fillCityField(user.city);
  await registerPage.fillStateField(user.state);
  await registerPage.fillZipCodeField(user.zipCode);
  await registerPage.fillPhoneNumberField(user.phoneNumber);
  await registerPage.fillSsnField(user.ssn);
  await registerPage.fillUsernameField(user.username);
  await registerPage.fillPasswordField(user.password);
  await registerPage.fillConfirmPasswordField(user.password);


  await registerPage.clickRegisterButton();
  await registerPage.assertWelcomeMessageIsVisible(user.username);
});


const testParameters = [
  { firstName: '',
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty First Name field',
    message: EMPTY_FIRST_NAME
  },
  { firstName: user.firstName,
    lastName: '',
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty Last Name field',
    message: EMPTY_LAST_NAME
  },
  { firstName: user.firstName,
    lastName: user.lastName,
    address: '',
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty Adress field',
    message: EMPTY_ADRESS
  },
  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: '',
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty City field',
    message: EMPTY_CITY
  },
  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: '',
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty State field',
    message: EMPTY_STATE
  },

  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: '',
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty Zip Code field',
    message: EMPTY_ZIP_CODE
  },

  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: '',
    username: user.username,
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty Snn field',
    message: EMPTY_SSN
  },

  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: '',
    password: user.password,
    confirmPassword: user.password,
    title: 'Empty Username field',
    message: EMPTY_USERNAME
  },

  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: '',
    confirmPassword: '',
    title: 'Empty Password field',
    message: EMPTY_PASSWORD
  },

  { firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    phoneNumber: user.phoneNumber,
    ssn: user.ssn,
    username: user.username,
    password: user.password,
    confirmPassword: '',
    title: 'Empty Confirmation Password field',
    message: COMFIRMATION_PASSSORD
  },
];


test.describe('Register user with validation errors', () => {
  testParameters.forEach(({ firstName, lastName, address, city, state, zipCode,
    phoneNumber, ssn, username, password, confirmPassword, title, message }) => {

    test(`Register user with ${title}`, async ({ registerPage }) => {
      await tagTest({ severity: Severity.MINOR, feature: 'Authentication', story: 'Registration' });

      await registerPage.open();

      await registerPage.fillFirstNameField(firstName);
      await registerPage.fillLastNameField(lastName);
      await registerPage.fillAddressField(address);
      await registerPage.fillCityField(city);
      await registerPage.fillStateField(state);
      await registerPage.fillZipCodeField(zipCode);
      await registerPage.fillPhoneNumberField(phoneNumber);
      await registerPage.fillSsnField(ssn);
      await registerPage.fillUsernameField(username);
      await registerPage.fillPasswordField(password);
      await registerPage.fillConfirmPasswordField(confirmPassword);


      await registerPage.clickRegisterButton();
      await registerPage.assertErrorMessageIsVisisble(message);
    });
  });
});
