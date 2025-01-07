import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { createTestDriver } from "./pagination.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/pagination/${exampleName}`);

  const driver = createTestDriver(page);

  return {
    driver
  };
}

test.describe("Critical Functionality", () => {
  test(`GIVEN a pagination control
        WHEN the pagination is rendered
        THEN the page controls should be visible`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getNextButton()).toBeVisible();
    await expect(d.getPrevButton()).toBeVisible();
    await expect(d.getPageAtIndex(0)).toBeVisible();
    await expect(d.getEllipsis()).toBeVisible();
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered
        THEN the first page control should be the current page`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getPageAtIndex(1)).toHaveAttribute("data-current");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered
        THEN other page controls should not be the current page`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getPageAtIndex(2)).not.toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(2)).not.toHaveAttribute("aria-current", "page");
    await expect(d.getPageAtIndex(3)).not.toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(3)).not.toHaveAttribute("aria-current", "page");
    await expect(d.getPageAtIndex(4)).not.toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(4)).not.toHaveAttribute("aria-current", "page");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the third page selected
        THEN the selected page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getPageAtIndex(4)).not.toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(4)).not.toHaveAttribute("disabled");
    await d.getPageAtIndex(4).click();
    await expect(d.getPageAtIndex(4)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(4)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the last button clicked
        THEN the last page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "first-last");

    await expect(d.getFirstButton()).toBeVisible();
    await expect(d.getLastButton()).toBeVisible();

    await d.getLastButton().click();
    await expect(d.getPageAtIndex(11)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(11)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the first button clicked
        THEN the first page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "first-last");

    await expect(d.getFirstButton()).toBeVisible();
    await expect(d.getLastButton()).toBeVisible();

    await d.getLastButton().click();
    await d.getFirstButton().click();
    await expect(d.getPageAtIndex(2)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(2)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the default page is set to 5
        THEN the fifth page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "page");

    await expect(d.getPageAtIndex(5)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(5)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the per page is set to 4 and next button is clicked
        THEN the fifth page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "per-page");

    await d.getNextButton().click();
    await expect(d.getPageAtIndex(5)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(5)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the per page is set to 4 and next button is clicked three times
        THEN the last page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "per-page");

    await d.getNextButton().click();
    await d.getNextButton().click();
    await d.getNextButton().click();
    await expect(d.getPageAtIndex(10)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(10)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the per page is set to 4 and previous button is clicked
        THEN the sixth page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "per-page");

    await d.getLastButton().click();
    await d.getPrevButton().click();
    await expect(d.getPageAtIndex(6)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(6)).toHaveAttribute("disabled");
  });

  test(`GIVEN a pagination control
        WHEN the pagination is rendered and the per page is set to 4 and previous button is clicked three times
        THEN the first page should be current and disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, "per-page");

    await d.getLastButton().click();
    await d.getPrevButton().click();
    await d.getPrevButton().click();
    await d.getPrevButton().click();
    await expect(d.getPageAtIndex(1)).toHaveAttribute("data-current");
    await expect(d.getPageAtIndex(1)).toHaveAttribute("disabled");
  });
});

test.describe("A11y", () => {
  test(`GIVEN a pagination control
        WHEN the pagination is rendered
        THEN it should meet the axe a11y requirements
    `, async ({ page }) => {
    await setup(page, "hero");

    const initialResults = await new AxeBuilder({ page })
      .include("[data-current]")
      .analyze();

    expect(initialResults.violations).toEqual([]);
  });

  test(`GIVEN a pagination control
        WHEN the currently active page control is rendered
        THEN it should have the aria-current attribute`, async ({ page }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getActivePage()).toHaveAttribute("aria-current", "page");
  });
});
