import { test as sessionTest } from './fixturesSession';
import { NavigationMenu } from '../../src/ui/pages/accounts/navigation/NavigationMenu';
import { AccountOverviewPage } from '../../src/ui/pages/accounts/accountOverview/AccountOverviewPage';
import { AccountDetailsPage } from '../../src/ui/pages/accounts/accountOverview/AccountDetailsPage';
import { OpenNewAccountPage, ACCOUNT_TYPE } from '../../src/ui/pages/accounts/openNewAccount/OpenNewAccountPage';
import { TransferFundsPage } from '../../src/ui/pages/accounts/transferFunds/TransferFundsPage';
import { BillPayPage } from '../../src/ui/pages/accounts/billPay/BillPayPage';
import { FindTransactionsPage } from '../../src/ui/pages/accounts/findTransactions/FindTransactionsPage';
import { UpdateContactInfoPage } from '../../src/ui/pages/accounts/updateContactInfo/UpdateContactInfoPage';
import { RequestLoanPage } from '../../src/ui/pages/accounts/requestLoan/RequestLoanPage';

// Page-object fixtures for everything that requires a logged-in session.
// Each one depends on `loggedInUser` (from fixturesSession.ts) so Playwright
// registers/logs a user in first, then opens the relevant page - test
// bodies only need to fill in data and assert, never repeat navigation.
export const test = sessionTest.extend<{
  navigationMenu: NavigationMenu;
  accountOverviewPage: AccountOverviewPage;
  accountDetailsPage: AccountDetailsPage;
  openNewAccountPage: OpenNewAccountPage;
  transferFundsPage: TransferFundsPage;
  billPayPage: BillPayPage;
  findTransactionsPage: FindTransactionsPage;
  updateContactInfoPage: UpdateContactInfoPage;
  requestLoanPage: RequestLoanPage;
  secondAccountId: string;
}>({
  navigationMenu: async ({ page, loggedInUser }, use) => {
    await use(new NavigationMenu(page));
  },

  accountOverviewPage: async ({ page, loggedInUser }, use) => {
    const accountOverviewPage = new AccountOverviewPage(page);

    await accountOverviewPage.open();
    await use(accountOverviewPage);
  },

  accountDetailsPage: async ({ page, loggedInUser }, use) => {
    const accountDetailsPage = new AccountDetailsPage(page);

    await accountDetailsPage.open(loggedInUser.accountId);
    await use(accountDetailsPage);
  },

  openNewAccountPage: async ({ page, loggedInUser }, use) => {
    const openNewAccountPage = new OpenNewAccountPage(page);

    await openNewAccountPage.open();
    await use(openNewAccountPage);
  },

  transferFundsPage: async ({ page, loggedInUser }, use) => {
    const transferFundsPage = new TransferFundsPage(page);

    await transferFundsPage.open();
    await use(transferFundsPage);
  },

  billPayPage: async ({ page, loggedInUser }, use) => {
    const billPayPage = new BillPayPage(page);

    await billPayPage.open();
    await use(billPayPage);
  },

  findTransactionsPage: async ({ page, loggedInUser }, use) => {
    const findTransactionsPage = new FindTransactionsPage(page);

    await findTransactionsPage.open();
    await use(findTransactionsPage);
  },

  updateContactInfoPage: async ({ page, loggedInUser }, use) => {
    const updateContactInfoPage = new UpdateContactInfoPage(page);

    await updateContactInfoPage.open();
    await use(updateContactInfoPage);
  },

  requestLoanPage: async ({ page, loggedInUser }, use) => {
    const requestLoanPage = new RequestLoanPage(page);

    await requestLoanPage.open();
    await use(requestLoanPage);
  },

  // A funded second account (SAVINGS), used by Transfer Funds / Bill Pay
  // tests that need a distinct "to" account besides the default one created
  // at registration.
  secondAccountId: async ({ page, loggedInUser }, use) => {
    const openNewAccountPage = new OpenNewAccountPage(page);

    await openNewAccountPage.open();
    await openNewAccountPage.selectAccountType(ACCOUNT_TYPE.SAVINGS);
    await openNewAccountPage.selectFromAccount(loggedInUser.accountId);
    await openNewAccountPage.clickOpenNewAccount();
    const accountId = await openNewAccountPage.getNewAccountId();

    await use(accountId);
  },
});
