import { mergeTests } from '@playwright/test';
import { test as genericTest } from './fixturesGeneric';
import { test as accountsTest } from './fixturesAccounts';

// accountsTest already carries every fixture from fixturesSession.ts and
// fixturesAuth.ts (each extends the previous one), so merging it with the
// generic test fixtures here is enough to cover the whole chain.
export const test = mergeTests(genericTest, accountsTest);
