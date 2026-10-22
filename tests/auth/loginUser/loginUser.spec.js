import { test } from '../../_fixtures/fixtures';
import { LoginPage } from '../../../src/ui/pages/auth/loginUser/LoginPage';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import {
  INVALID_LOGIN,
  EMPTY_LOGIN_FIELDS,
} from '../../../src/ui/pages/constants/authErrorMessage';

test('User can log in with valid credentials', async ({ pages, registeredUser }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Authentication', story: 'Login' });

  const loginPage = new LoginPage(pages[0]);

  await loginPage.open();
  await loginPage.fillUsernameField(registeredUser.username);
  await loginPage.fillPasswordField(registeredUser.password);
  await loginPage.clickLoginButton();
  await loginPage.assertWelcomeMessageIsVisible();
});

test('User cannot log in with a wrong password', async ({ pages, registeredUser }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Authentication', story: 'Login' });

  const loginPage = new LoginPage(pages[0]);

  await loginPage.open();
  await loginPage.fillUsernameField(registeredUser.username);
  await loginPage.fillPasswordField(`${registeredUser.password}-wrong`);
  await loginPage.clickLoginButton();
  await loginPage.assertLoginErrorIsVisible(INVALID_LOGIN);
});

test('User cannot log in with a non-existent username', async ({ pages }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Authentication', story: 'Login' });

  const loginPage = new LoginPage(pages[0]);

  await loginPage.open();
  await loginPage.fillUsernameField('no-such-user-1234567890');
  await loginPage.fillPasswordField('whatever-password');
  await loginPage.clickLoginButton();
  await loginPage.assertLoginErrorIsVisible(INVALID_LOGIN);
});

test('User cannot log in with empty username and password', async ({ pages }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Authentication', story: 'Login' });

  const loginPage = new LoginPage(pages[0]);

  await loginPage.open();
  await loginPage.clickLoginButton();
  await loginPage.assertLoginErrorIsVisible(EMPTY_LOGIN_FIELDS);
});

const partialCredentials = [
  { username: '', password: 'SomePassword1', title: 'Empty username' },
  { username: 'SomeUsername', password: '', title: 'Empty password' },
];

test.describe('Login with a partially filled form', () => {
  partialCredentials.forEach(({ username, password, title }) => {
    test(`${title}`, async ({ pages }) => {
      await tagTest({ severity: Severity.MINOR, feature: 'Authentication', story: 'Login' });

      const loginPage = new LoginPage(pages[0]);

      await loginPage.open();
      await loginPage.fillUsernameField(username);
      await loginPage.fillPasswordField(password);
      await loginPage.clickLoginButton();
      await loginPage.assertLoginErrorIsVisible(EMPTY_LOGIN_FIELDS);
    });
  });
});
