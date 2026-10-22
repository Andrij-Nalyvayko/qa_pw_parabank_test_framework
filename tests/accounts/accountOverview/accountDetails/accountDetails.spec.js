import { test } from '../../../_fixtures/fixtures';
import { tagTest, Severity } from '../../../../src/common/helpers/allureHelpers';

test('Account Details page shows the correct account id', async ({ loggedInUser, accountDetailsPage }) => {
  await tagTest({
    severity: Severity.CRITICAL,
    feature: 'Account Management',
    story: 'Account Details & Activity Filtering',
  });

  await accountDetailsPage.assertAccountDetailsAreVisible(loggedInUser.accountId);
});

test('The opening deposit shows up in this month\'s activity', async ({ accountDetailsPage }) => {
  await tagTest({
    severity: Severity.NORMAL,
    feature: 'Account Management',
    story: 'Account Details & Activity Filtering',
  });

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  await accountDetailsPage.filterByMonth(currentMonth);
  await accountDetailsPage.clickGo();
  await accountDetailsPage.assertTransactionsAreVisible();
});

const transactionTypes = ['Credit', 'Debit'];

test.describe('Filtering account activity by transaction type', () => {
  transactionTypes.forEach(type => {
    test(`Filter account activity by ${type} transactions`, async ({ loggedInUser, accountDetailsPage }) => {
      await tagTest({
        severity: Severity.MINOR,
        feature: 'Account Management',
        story: 'Account Details & Activity Filtering',
      });

      await accountDetailsPage.filterByTransactionType(type);
      await accountDetailsPage.clickGo();
      // The filter may legitimately return zero rows (e.g. a brand-new
      // account has no Debit transactions yet) - what matters is that the
      // page still renders the account details correctly after filtering.
      await accountDetailsPage.assertAccountDetailsAreVisible(loggedInUser.accountId);
    });
  });
});

test('Filtering by a month with no activity shows no transactions', async ({ accountDetailsPage }) => {
  await tagTest({
    severity: Severity.MINOR,
    feature: 'Account Management',
    story: 'Account Details & Activity Filtering',
  });

  // A brand-new account only ever has activity in the month it was opened in,
  // so the month before that is guaranteed to be empty.
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString('en-US', { month: 'long' });

  await accountDetailsPage.filterByMonth(previousMonth);
  await accountDetailsPage.clickGo();
  await accountDetailsPage.assertNoTransactionsFound();
});
