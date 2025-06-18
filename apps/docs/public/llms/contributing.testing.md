# Contributing Testing

Accessible via: `/contributing/testing`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import testing from "~/assets/docs/testing/testing.webp";

# Testing

<Image src={testing} loading="eager" alt="Testing" />

It is a requirement that every component has tests before it can be out of preview.

## Unit testing

To verify data outputs, we use [Vitest](https://vitest.dev/). For example, a date picker component could have unit tests that verify:

- Date format conversion
- Preset date generators
- Range validation
- Date Parsing and helper methods

## Component testing / e2e testing

To test interactions, we use [Playwright](https://playwright.dev/). 

For example, a date picker component might have tests that verify:

- Date selection
- Date range selection
- Date mouse navigation
- Date format
- Date keyboard navigation
- Date configuration and props

### Driver file

Each component folder contains a `<component-name>.driver.ts` file. This file contains a `createTestDriver` function that returns a set of functions that can be used to test the pieces of the component.

```tsx
import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-otp-root]");
  };

  const getItems = () => {
    return rootLocator.locator("[data-qds-otp-item]");
  };

  const getInput = () => {
    return rootLocator.locator("[data-qds-otp-hidden-input]");
  };

  const getItemAt = (index: number) => {
    return rootLocator.locator(`[data-qds-otp-item="${index}"]`);
  };

  const getHighlightedItem = () => {
    return rootLocator.locator("[data-highlighted]");
  };

  const getCaretAt = (index: number) => {
    return rootLocator.locator(`[data-qds-otp-caret="${index}"]`);
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getItems,
    getInput,
    getItemAt,
    getCaretAt,
    getHighlightedItem
  };
}
```

In the example above, the `createTestDriver` function is used to create a driver for the OTP component.

### An isolated test

Playwright is an awesome tool for verifying interactions, but it is not intentionally designed for component testing.

Unfortunately, Playwright does not support component testing, it has been experimental for a couple of years, and the [maintainers have stated that it is not a priority](https://github.com/microsoft/playwright/pull/27783#issuecomment-2400533724).

Instead, we have a separate application, `apps/docs/components`, that is used to test the components in isolation.

Whenever you make a new showcase example in the docs, you've created a new isolated route in the testing app! 

1. Create a setup function in the test file

```tsx
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/otp/${exampleName}`);
  const driver = createTestDriver(page);
  const input = driver.getInput();
  await input.focus();
  await setupEventListeners(input);
  return driver;
}
```

> The route structure for the component tests app is `base/component-name/example-name`.



### Given, When, Then

When writing tests, we use the [Given, When, Then](https://martinfowler.com/bliki/GivenWhenThen.html) convention.

**Given** - The initial state of the component.

**When** - The action taken on the component.

**Then** - The expected outcome of the action.

```tsx
  test(`GIVEN a checkbox that is initially checked
        WHEN the trigger is clicked
        THEN the indicator should be hidden`, async ({ page }) => {
    const d = await setup(page, "hero");

    // initial setup
    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();

    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeHidden();
  });
```

## Test Driven Development

[Test Driven Development (TDD)](https://martinfowler.com/bliki/TestDrivenDevelopment.html) is a development process that emphasizes writing out the intended behavior before writing the code.

The process is as follows:

1. Write a test
2. Run the test and see it fails
3. Write the code to pass the test

It is preferred to write the tests before the code, but it is not required.

For a more visual explanation, check out [this talk by Shai Reznik](https://www.youtube.com/watch?v=KHaeVaSkhIE). Angular is in the video, but the principles apply to any language and framework.







