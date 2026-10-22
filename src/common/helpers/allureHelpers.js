import * as allure from 'allure-js-commons';
import { camelCaseToPhrase, capitalize } from './stringHelpers';

export const Severity = allure.Severity;

/**
 * Tags a test with Allure metadata that isn't already derived from the
 * folder structure (see parseTestTreeHierarchy): severity and the
 * feature/sub-feature (Allure's "story") this test belongs to.
 */
export async function tagTest({ severity, feature, story }) {
  if (severity) {
    await allure.severity(severity);
  }
  if (feature) {
    await allure.feature(feature);
  }
  if (story) {
    await allure.story(story);
  }
}

export function parseTestTreeHierarchy(fileName, logger) {
  const testFolder = 'tests/';

  const attributesCamelCase = fileName
    .substring(fileName.indexOf(testFolder) + testFolder.length)
    .split('/');

  let attributes = attributesCamelCase.map(attribute =>
    capitalize(camelCaseToPhrase(attribute)),
  );

  if (attributes[2].includes('.spec.js')) {
    attributes = attributes.slice(0, 2);
  }

  logger.debug(`Parsed test hierarchy: ${JSON.stringify(attributes)}`);

  return attributes;
}
