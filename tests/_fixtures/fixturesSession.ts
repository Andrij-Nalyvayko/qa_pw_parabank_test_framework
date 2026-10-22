import { test as authTest } from './fixturesAuth';
import { AccountOverviewPage } from '../../src/ui/pages/accounts/accountOverview/AccountOverviewPage';
import { generateUserData } from '../../src/common/testData/generateUserData';

type LoggedInUser = ReturnType<typeof generateUserData> & { accountId: string };

// Bridges "not logged in" functionality (registration, in fixturesAuth.ts)
// with "logged in" functionality (everything under tests/accounts).
// ParaBank logs a customer in automatically right after registration, so we
// reuse the already-resilient `registeredUser` fixture instead of driving
// the login form again, and just read the auto-created default account id
// off the Accounts Overview page.
export const test = authTest.extend<{
  loggedInUser: LoggedInUser;
}>({
  loggedInUser: async ({ page, registeredUser }, use) => {
    const accountOverviewPage = new AccountOverviewPage(page);

    await accountOverviewPage.open();
    const accountId = await accountOverviewPage.getFirstAccountId();

    await use({ ...registeredUser, accountId });
  },
});
