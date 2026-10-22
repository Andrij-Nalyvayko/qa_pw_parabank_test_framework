import { test as base, Page, BrowserContext } from '@playwright/test';
import { Logger } from '../../src/common/logger/Logger';
import * as allure from 'allure-js-commons';
import { parseTestTreeHierarchy } from '../../src/common/helpers/allureHelpers';

export const test = base.extend<
  {
    infoTestLog: string;
    addAllureTestHierarchy: string;
    pages: Page[]; // Правильний тип масиву об'єктів Page
    contextsNumber: number; // Має бути number, а не string
  },
  {
    logger: Logger;
  }
>({
  logger: [
    async ({}, use) => {
      const logger = new Logger('error');
      await use(logger);
    },
    { scope: 'worker' },
  ],

  infoTestLog: [
    async ({ logger }, use, testInfo) => {
      const indexOfTestSubfolderStart = testInfo.file.indexOf('/tests') + 7;
      const fileName = testInfo.file.substring(indexOfTestSubfolderStart);

      logger.info(`Test started: ${fileName}`);
      await use('infoTestLog');
      logger.info(`Test completed: ${fileName}`);
    },
    { scope: 'test', auto: true },
  ],

  addAllureTestHierarchy: [
    async ({ logger }, use, testInfo) => {
      const fileName = testInfo.file;

      const [parentSuite, suite, subSuite] = parseTestTreeHierarchy(
        fileName,
        logger,
      );

      await allure.parentSuite(parentSuite);
      await allure.suite(suite);
      if (subSuite) {
        await allure.subSuite(subSuite);
      }

      await use('addAllureTestHierarchy');
    },
    { scope: 'test', auto: true },
  ],

  // Опція для регулювання кількості паралельних контекстів
  contextsNumber: [1, { option: true }],

  pages: async ({ browser, contextsNumber }, use) => {
    const contexts: BrowserContext[] = [];
    const pages: Page[] = [];

    // Паралельне створення контекстів та сторінок
    for (let i = 0; i < contextsNumber; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
    }

    // Віддаємо масив сторінок у тест
    await use(pages);

    // CLEANUP: Автоматичне закриття контекстів після виконання тесту
    await Promise.all(contexts.map((context) => context.close()));
  },
});

export { expect } from '@playwright/test';
