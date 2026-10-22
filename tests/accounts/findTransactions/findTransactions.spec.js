import { test } from '../../_fixtures/fixtures';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';

function today() {
  const date = new Date();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${mm}-${dd}-${date.getFullYear()}`;
}

test('A customer can find today\'s opening deposit by date range', async ({
  loggedInUser,
  findTransactionsPage,
}) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Account Management', story: 'Find Transactions' });

  await findTransactionsPage.selectAccount(loggedInUser.accountId);
  await findTransactionsPage.findByDateRange(today(), today());
  await findTransactionsPage.assertTransactionIsFound();
});

test('A customer can find a transaction by its exact amount', async ({
  loggedInUser,
  accountOverviewPage,
  findTransactionsPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Account Management', story: 'Find Transactions' });

  // On a brand-new account, the balance equals the single opening deposit -
  // so searching by that amount is guaranteed to match exactly one transaction.
  const openingDepositAmount = await accountOverviewPage.getAccountBalance(loggedInUser.accountId);

  await findTransactionsPage.selectAccount(loggedInUser.accountId);
  await findTransactionsPage.findByAmount(openingDepositAmount);
  await findTransactionsPage.assertTransactionIsFound();
});

test('Searching for a non-existent transaction id returns no results', async ({
  loggedInUser,
  findTransactionsPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Account Management', story: 'Find Transactions' });

  await findTransactionsPage.selectAccount(loggedInUser.accountId);
  await findTransactionsPage.findByTransactionId(999999999);
  await findTransactionsPage.assertTransactionNotFound();
});
