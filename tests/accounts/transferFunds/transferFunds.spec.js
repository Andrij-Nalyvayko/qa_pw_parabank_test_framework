import { test } from '../../_fixtures/fixtures';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import { INTERNAL_ERROR } from '../../../src/ui/pages/constants/authErrorMessage';

test('A customer can transfer funds between their own accounts', async ({
  loggedInUser,
  secondAccountId,
  accountOverviewPage,
  transferFundsPage,
}) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Money Movement', story: 'Transfer Funds' });

  const amount = 50;

  await accountOverviewPage.open();
  const balanceBefore = await accountOverviewPage.getAccountBalance(loggedInUser.accountId);

  await transferFundsPage.open();
  await transferFundsPage.fillAmount(amount);
  await transferFundsPage.selectFromAccount(loggedInUser.accountId);
  await transferFundsPage.selectToAccount(secondAccountId);
  await transferFundsPage.clickTransfer();
  await transferFundsPage.assertTransferIsComplete(amount, loggedInUser.accountId, secondAccountId);

  await accountOverviewPage.open();
  await accountOverviewPage.assertBalanceIs(loggedInUser.accountId, balanceBefore - amount);
});

// NOTE: ParaBank's demo backend is widely documented to skip server-side
// validation on the transfer amount - it accepts zero/negative amounts and
// overdrafts instead of rejecting them. These two tests pin down that
// (unusual but real) behaviour; if a future ParaBank build starts
// validating this field, these are the tests that should start failing and
// need updating.
const unvalidatedAmounts = [0, -25];

test.describe('Transfer Funds does not validate the amount range', () => {
  unvalidatedAmounts.forEach(amount => {
    test(`Transferring $${amount} is accepted instead of rejected`, async ({
      loggedInUser,
      secondAccountId,
      transferFundsPage,
    }) => {
      await tagTest({ severity: Severity.NORMAL, feature: 'Money Movement', story: 'Transfer Funds' });

      await transferFundsPage.fillAmount(amount);
      await transferFundsPage.selectFromAccount(loggedInUser.accountId);
      await transferFundsPage.selectToAccount(secondAccountId);
      await transferFundsPage.clickTransfer();
      await transferFundsPage.assertTransferIsComplete(amount, loggedInUser.accountId, secondAccountId);
    });
  });
});

test('Transferring more than the available balance still succeeds (known overdraft bug)', async ({
  loggedInUser,
  secondAccountId,
  accountOverviewPage,
  transferFundsPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Money Movement', story: 'Transfer Funds' });

  const balance = await accountOverviewPage.getAccountBalance(loggedInUser.accountId);
  const amount = balance + 1000;

  await transferFundsPage.fillAmount(amount);
  await transferFundsPage.selectFromAccount(loggedInUser.accountId);
  await transferFundsPage.selectToAccount(secondAccountId);
  await transferFundsPage.clickTransfer();
  await transferFundsPage.assertTransferIsComplete(amount, loggedInUser.accountId, secondAccountId);
});

test('A non-numeric transfer amount is rejected with an application error', async ({
  loggedInUser,
  secondAccountId,
  transferFundsPage,
}) => {
  await tagTest({ severity: Severity.MINOR, feature: 'Money Movement', story: 'Transfer Funds' });

  await transferFundsPage.fillAmount('not-a-number');
  await transferFundsPage.selectFromAccount(loggedInUser.accountId);
  await transferFundsPage.selectToAccount(secondAccountId);
  await transferFundsPage.clickTransfer();
  await transferFundsPage.assertErrorIsVisible(INTERNAL_ERROR);
});
