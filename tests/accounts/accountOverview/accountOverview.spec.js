import { test } from '../../_fixtures/fixtures';
import { AccountDetailsPage } from '../../../src/ui/pages/accounts/accountOverview/AccountDetailsPage';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';

test('A newly registered customer sees their default account in the overview', async ({
  page,
  loggedInUser,
  accountOverviewPage,
}) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Account Management', story: 'Account Overview' });

  await accountOverviewPage.assertAccountsOverviewIsVisible();
  await accountOverviewPage.assertAccountIsListed(loggedInUser.accountId);
});

test('The total row equals the sum of every account balance', async ({ accountOverviewPage }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Account Management', story: 'Account Overview' });

  await accountOverviewPage.assertTotalBalanceIsSumOfAccounts();
});

test('Clicking an account in the overview opens its Account Details page', async ({
  page,
  loggedInUser,
  accountOverviewPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Account Management', story: 'Account Overview' });

  await accountOverviewPage.clickAccount(loggedInUser.accountId);

  const accountDetailsPage = new AccountDetailsPage(page);

  await accountDetailsPage.assertAccountDetailsAreVisible(loggedInUser.accountId);
});
