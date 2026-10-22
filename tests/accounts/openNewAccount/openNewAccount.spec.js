import { test } from '../../_fixtures/fixtures';
import { ACCOUNT_TYPE } from '../../../src/ui/pages/accounts/openNewAccount/OpenNewAccountPage';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';

const accountTypes = [ACCOUNT_TYPE.CHECKING, ACCOUNT_TYPE.SAVINGS];

test.describe('Opening a new account', () => {
  accountTypes.forEach(type => {
    test(`A customer can open a new ${type} account`, async ({
      loggedInUser,
      accountOverviewPage,
      openNewAccountPage,
    }) => {
      await tagTest({ severity: Severity.CRITICAL, feature: 'Account Management', story: 'Open New Account' });

      await openNewAccountPage.selectAccountType(type);
      await openNewAccountPage.selectFromAccount(loggedInUser.accountId);
      await openNewAccountPage.clickOpenNewAccount();
      await openNewAccountPage.assertNewAccountIsOpened();

      const newAccountId = await openNewAccountPage.getNewAccountId();

      await accountOverviewPage.open();
      await accountOverviewPage.assertAccountIsListed(newAccountId);
    });
  });
});

test('A freshly opened account can immediately fund another new account', async ({
  loggedInUser,
  secondAccountId,
  openNewAccountPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Account Management', story: 'Open New Account' });

  await openNewAccountPage.selectAccountType(ACCOUNT_TYPE.CHECKING);
  await openNewAccountPage.selectFromAccount(secondAccountId);
  await openNewAccountPage.clickOpenNewAccount();
  await openNewAccountPage.assertNewAccountIsOpened();
});
