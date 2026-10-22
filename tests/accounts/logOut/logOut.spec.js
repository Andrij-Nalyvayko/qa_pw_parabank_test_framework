import { test } from '../../_fixtures/fixtures';
import { LoginPage } from '../../../src/ui/pages/auth/loginUser/LoginPage';
import { AccountOverviewPage } from '../../../src/ui/pages/accounts/accountOverview/AccountOverviewPage';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import { INTERNAL_ERROR } from '../../../src/ui/pages/constants/authErrorMessage';

test('Logging out returns the customer to the login page', async ({ page, navigationMenu }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Authentication', story: 'Log Out' });

  await navigationMenu.clickLogOut();

  const loginPage = new LoginPage(page);

  await loginPage.assertLoginFormIsVisible();
});

test('The account session is invalidated after logging out', async ({ page, navigationMenu }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Authentication', story: 'Log Out' });

  await navigationMenu.clickLogOut();

  const accountOverviewPage = new AccountOverviewPage(page);

  await accountOverviewPage.open();
  await navigationMenu.assertMenuIsNotVisible();

  const loginPage = new LoginPage(page);

  await loginPage.assertLoginErrorIsVisible(INTERNAL_ERROR);
});
