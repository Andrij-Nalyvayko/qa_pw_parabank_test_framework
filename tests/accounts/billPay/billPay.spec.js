import { test } from '../../_fixtures/fixtures';
import { generateUserData } from '../../../src/common/testData/generateUserData';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';
import { ACCOUNT_NUMBERS_DO_NOT_MATCH } from '../../../src/ui/pages/constants/accountErrorMessage';

function payeeFromUserData() {
  const payee = generateUserData();

  return {
    payeeName: `${payee.firstName} ${payee.lastName}`,
    address: payee.address,
    city: payee.city,
    state: payee.state,
    zipCode: payee.zipCode,
    phoneNumber: payee.phoneNumber,
  };
}

test('A customer can pay a bill from their account', async ({ loggedInUser, billPayPage }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Money Movement', story: 'Bill Pay' });

  const payee = payeeFromUserData();

  await billPayPage.payBill({
    ...payee,
    accountNumber: loggedInUser.accountId,
    verifyAccount: loggedInUser.accountId,
    amount: 25,
    fromAccountId: loggedInUser.accountId,
  });
  await billPayPage.assertPaymentIsComplete();
});

test('Bill Pay rejects a payment when the account numbers do not match', async ({ loggedInUser, billPayPage }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Money Movement', story: 'Bill Pay' });

  const payee = payeeFromUserData();

  await billPayPage.payBill({
    ...payee,
    accountNumber: loggedInUser.accountId,
    verifyAccount: `${loggedInUser.accountId}1`,
    amount: 25,
    fromAccountId: loggedInUser.accountId,
  });
  await billPayPage.assertErrorIsVisible(ACCOUNT_NUMBERS_DO_NOT_MATCH);
});

const invalidAmounts = ['0', '-10'];

test.describe('Bill Pay with an invalid amount', () => {
  invalidAmounts.forEach(amount => {
    test(`Paying a bill with an amount of ${amount} is accepted (known lack of validation)`, async ({
      loggedInUser,
      billPayPage,
    }) => {
      await tagTest({ severity: Severity.MINOR, feature: 'Money Movement', story: 'Bill Pay' });

      const payee = payeeFromUserData();

      await billPayPage.payBill({
        ...payee,
        accountNumber: loggedInUser.accountId,
        verifyAccount: loggedInUser.accountId,
        amount,
        fromAccountId: loggedInUser.accountId,
      });
      await billPayPage.assertPaymentIsComplete();
    });
  });
});
