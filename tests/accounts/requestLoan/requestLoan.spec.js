import { test } from '../../_fixtures/fixtures';
import { tagTest, Severity } from '../../../src/common/helpers/allureHelpers';

// ParaBank's loan approval logic is a black box from the UI's point of view
// (the decision depends on the amount/down-payment ratio against the demo
// bank's rules) - these tests don't assume a specific outcome, they assert
// that the request is always fully processed into a definitive decision.
test('A loan request with a healthy down payment is processed', async ({ loggedInUser, requestLoanPage }) => {
  await tagTest({ severity: Severity.CRITICAL, feature: 'Lending', story: 'Request Loan' });

  await requestLoanPage.fillAmount(5000);
  await requestLoanPage.fillDownPayment(2500);
  await requestLoanPage.selectFromAccount(loggedInUser.accountId);
  await requestLoanPage.clickApplyNow();
  await requestLoanPage.assertLoanRequestIsProcessed();
});

test('A loan request with no down payment is processed', async ({ loggedInUser, requestLoanPage }) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Lending', story: 'Request Loan' });

  await requestLoanPage.fillAmount(50000);
  await requestLoanPage.fillDownPayment(0);
  await requestLoanPage.selectFromAccount(loggedInUser.accountId);
  await requestLoanPage.clickApplyNow();
  await requestLoanPage.assertLoanRequestIsProcessed();
});

test('An approved loan opens a new account visible in the overview', async ({
  loggedInUser,
  accountOverviewPage,
  requestLoanPage,
}) => {
  await tagTest({ severity: Severity.NORMAL, feature: 'Lending', story: 'Request Loan' });

  await requestLoanPage.fillAmount(1000);
  await requestLoanPage.fillDownPayment(1000);
  await requestLoanPage.selectFromAccount(loggedInUser.accountId);
  await requestLoanPage.clickApplyNow();
  await requestLoanPage.assertLoanRequestIsProcessed();
  await requestLoanPage.assertNewLoanAccountIsListedWhenApproved(accountOverviewPage);
});
