import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./resizable.driver";
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/resizable/${exampleName}`);

  const driver = createTestDriver(page);

  return driver;
}

test.describe("critical functionality", () => {});

test.describe("state", () => {});

test.describe("a11y", () => {});
