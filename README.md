# Task Description

To see the description of the task assignment [follow the link](https://github.com/mate-academy/qa_pw_parabank_test_framework/blob/main/TaskDescription.md). 

# Repository Overview

This repository contains a test automation framework for the [Parabank](https://parabank.parasoft.com/parabank/index.htm) bank application testing. 

# How to use this project

## Installation steps

To install the project follow the next steps:

1. Install Node.js.
2. Run the installation command in the project root.:
```bash
npm ci
```
3. Run the browsers installation in the project root.
```bash
npx playwright install
```
4. Install Allure commandline tool (Allure requires Java 8 or higher).
```bash
npm install -g allure-commandline
```

## How to run the tests

Run the whole suite (headless, Chromium):
```bash
npx playwright test
```

Run a single suite/folder, e.g. everything under "Transfer Funds":
```bash
npx playwright test tests/accounts/transferFunds
```

Run a single file or a single test by name:
```bash
npx playwright test tests/auth/loginUser/loginUser.spec.js
npx playwright test -g "A customer can transfer funds between their own accounts"
```

Useful while writing/debugging tests:
```bash
npx playwright test --headed   # watch the browser while the test runs
npx playwright test --debug    # step through a test with the Playwright Inspector
npx playwright test --ui       # Playwright's interactive UI mode
```

> ParaBank is a public, shared demo server. If a run fails with an
> unexpected error (e.g. registration failing with "username already
> exists" for a clearly unique name), the demo backend is most likely
> rate-limiting/struggling under load from many simultaneous users - wait
> a few minutes and re-run.

## How to generate report

Every run (via the `allure-playwright` reporter configured in
`playwright.config.js`) writes raw results into `./allure-results`. Turn
them into a browsable report with the Allure commandline tool:

```bash
# Generate a static report into ./allure-report and open it
npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report
```

Or do both in one step with a temporary local server:
```bash
npx allure serve ./allure-results
```

The report groups tests by the `parentSuite` / `suite` / `subSuite` derived
from the `tests/` folder structure (e.g. `Accounts` / `Account Overview` /
`Account Details`), and by `feature` / `story` (e.g. `Money Movement` /
`Transfer Funds`) plus a `severity` set on every test, so you can filter by
either dimension in the report's sidebar.

## Test coverage

| Suite (`tests/...`) | Covers |
| --- | --- |
| `auth/registerUser` | Registration - happy path + one test per required field left empty |
| `auth/loginUser` | Login - valid credentials, wrong password, unknown username, empty/partial form |
| `auth/forgotLoginInfo` | "Forgot login info?" look-up - found, not found, one test per required field left empty |
| `accounts/accountOverview` | Accounts Overview table, total balance, navigating into an account |
| `accounts/accountOverview/accountDetails` | Account Details page + Account Activity filtering by month/transaction type |
| `accounts/openNewAccount` | Opening a CHECKING/SAVINGS account, funding one new account from another |
| `accounts/transferFunds` | Transfer between own accounts, balance update, and the amount field's lack of server-side validation (zero/negative/overdraft amounts) |
| `accounts/billPay` | Paying a bill, the "account numbers do not match" validation, invalid amounts |
| `accounts/findTransactions` | Search by date range, by amount, and a not-found transaction id |
| `accounts/updateContactInfo` | Updating contact details + one test per required field left empty |
| `accounts/requestLoan` | Loan requests are always resolved to approved/denied; an approved loan opens a new account |
| `accounts/logOut` | Logging out returns to the login page and invalidates the session |

> Some of the assertions above target ParaBank's well-documented quirks
> (e.g. Transfer Funds/Bill Pay accepting amounts that should probably be
> rejected). They describe the app's *current real* behaviour rather than
> an idealised one - if a bug fix ever changes that behaviour, these are
> the tests expected to fail and need a second look.
