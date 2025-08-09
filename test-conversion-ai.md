# Playwright to Vitest Browser API Conversion Guide

## Overview

This prompt helps convert Playwright test files (`.test.ts`) and their corresponding driver files (`.driver.ts`) to use the Vitest Browser API format. The conversion maintains the same testing patterns while adapting to the Vitest browser testing environment.

## Project Context

- **Package Manager**: pnpm (use `pnpm` commands, not npm or yarn)
- **Test Framework**: Converting from Playwright to Vitest Browser API
- **Browser Provider**: Playwright (under the hood)
- **Component Library**: Qwik Design System components
- **Test Port**: Component tests run on `http://localhost:6174` specifically on the old playwright tests

## File Structure Pattern

For each component, you'll find:
- `component.test.ts` - Playwright tests (to be converted)
- `component.driver.ts` - Test driver with locator functions (to be adapted)
- `component.browser.tsx` - Target Vitest browser test file (to be created)

## Key Imports and Setup

### Standard Vitest Browser Test Imports
```typescript
import { $, type PropsOf, component$, useSignal, useStore } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { ComponentName } from "..";
```

### Locator Constants Pattern
Create top-level locator constants using `data-testid`:
```typescript
// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Label = page.getByTestId("label");
const Trigger = page.getByTestId("trigger");
const Indicator = page.getByTestId("indicator");
// ... other elements
```

## Conversion Patterns

### 1. Driver Function Conversion
**From Playwright Driver:**
```typescript
export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getTrigger = () => {
    return rootLocator.locator("[data-qds-component-trigger]");
  };
  return { getTrigger };
}
```

**To Vitest Browser Locators:**
```typescript
const Triggers = page.getByTestId("trigger");
```

### 2. Test Setup Conversion
**From Playwright:**
```typescript
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/component/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test(`GIVEN a radio group
      WHEN the first radio button is clicked
      THEN it should have correct checked state`, async ({ page }) => {
  const d = await setup(page, "hero");
  const firstTrigger = d.getTriggerAt(0);

  await firstTrigger.click();
  await expect(firstTrigger).toHaveAttribute("data-checked");
  await expect(firstTrigger).toHaveAttribute("aria-checked", "true");
});
```

**To Vitest Browser:**
```typescript
test("first radio button can be clicked and checked", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(0)).toHaveAttribute("aria-checked", "true");
});
```

### 3. User Interactions

#### Click Events
**Playwright:** `await d.getTrigger().click()`
**Vitest:** `await userEvent.click(Trigger)`

#### Keyboard Events
**Playwright:** `await d.getTrigger().press("Space")`
**Vitest:** 
```typescript
// For keys that require focus
await expect.element(Trigger).toBeVisible();
((await Trigger.element()) as HTMLButtonElement).focus();
await userEvent.keyboard("{Space}");
```

#### Keyboard Navigation
**Playwright:** `await page.keyboard.press("ArrowDown")`
**Vitest:** `await userEvent.keyboard("{ArrowDown}");`

#### Text Input
**Playwright:** `await input.fill("text")`
**Vitest:** `await userEvent.fill(Input, "text")`

### 4. Assertions

#### Element Visibility
**Playwright:** `await expect(d.getIndicator()).toBeVisible()`
**Vitest:** `await expect.element(Indicator).toBeVisible()`

#### Attributes
**Playwright:** `await expect(d.getTrigger()).toHaveAttribute("aria-checked", "true")`
**Vitest:** `await expect.element(Trigger).toHaveAttribute("aria-checked", "true")`

#### Element States
**Playwright:** `await expect(d.getTrigger()).toBeDisabled()`
**Vitest:** `await expect(Trigger).toBeDisabled()`

## Component Creation Patterns

### Example Component Template
```typescript
const Basic = component$((props: PropsOf<typeof ComponentName.Root>) => {
  return (
    <ComponentName.Root {...props} data-testid="root">
      <ComponentName.Label data-testid="label">Label Text</ComponentName.Label>
      {/* Map over test data */}
      {["Option 1", "Option 2", "Option 3"].map((value) => (
        <ComponentName.Item value={value} key={value} data-testid="item">
          <ComponentName.ItemLabel data-testid="item-label">{value}</ComponentName.ItemLabel>
          <ComponentName.ItemTrigger data-testid="trigger">
            <ComponentName.ItemIndicator data-testid="indicator">
              Indicator Content
            </ComponentName.ItemIndicator>
          </ComponentName.ItemTrigger>
        </ComponentName.Item>
      ))}
    </ComponentName.Root>
  );
});
```

Look at [Terminology](./apps/docs/src/routes/contributing/terminology) for more information on the component names. Also look at the examples in [Component Examples](./apps/docs/src/routes/base/radio-group/examples) for more information on the component structure.

### Example Form Integration Component
```typescript
const FormBasic = component$(() => {
  const isError = useSignal(false);
  const handleSubmit$ = $((e: SubmitEvent) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      isError.value = true;
    } else {
      isError.value = false;
    }
  });

  return (
    <form preventdefault:submit noValidate onSubmit$={handleSubmit$}>
      <ComponentName.Root
        required
        name="fieldName"
        data-testid="root"
        onChange$={() => {
          isError.value = false;
        }}
      >
        {/* Component content */}
        {isError.value && (
          <ComponentName.Error data-testid="error">
            Error message
          </ComponentName.Error>
        )}
      </ComponentName.Root>
      <button type="submit">Submit</button>
    </form>
  );
});
```

### Example External State Component
```typescript
const ExternalState = component$(() => {
  const selectedSignal = useSignal("initial");
  const selectedStore = useStore({ item: "initial" });

  return (
    <div>
      <ComponentName.Root
        data-testid="root"
        bind:value={selectedSignal}
        value={selectedStore.item}
        onChange$={(newValue) => {
          selectedStore.item = newValue;
        }}
      >
        {/* Component content */}
      </ComponentName.Root>
      <button
        type="button"
        data-testid="change-value"
        onClick$={() => (selectedStore.item = "newValue")}
      >
        Change Value
      </button>
    </div>
  );
});
```

## Special Cases

### Focus Management
When testing keyboard interactions that require focus:
```typescript
await expect.element(Triggers.nth(0)).toBeVisible();
((await Triggers.nth(0).element()) as HTMLButtonElement).focus();
await userEvent.keyboard("{Space}");
```

### Form Submissions
```typescript
await userEvent.click(page.getByText("Submit"));
await expect.element(Errors).toBeVisible();
```

When nodes have been conditionally removed from the DOM, you need to use `.not.toBeInTheDocument()` instead of `.toBeVisible()`.

### External Button Interactions
```typescript
// we have a button jsx node with data-testid="change-value" for example on the external state component with a qwik useStore hook
await userEvent.click(page.getByTestId("change-value"));

## Test Organization

Use test descriptions similar to those in @radio-group.browser.tsx: ./libs/components/src/radio-group/radio-group.browser.tsx
// test("external value changes update selection", async () => {
//   // test implementation
// });

// test("external signal changes update selection", async () => {
//   // test implementation
// });

We will move away from this GIVEN WHEN THEN format. It is too verbose and not very readable.

Remove test grouping if possible. Only group tests when it is extremely necessary.

## Common Patterns to Convert

1. **Setup function calls** → Direct `render()` calls
2. **Driver method calls** → Direct locator usage
3. **Playwright page interactions** → Vitest userEvent API
4. **Custom driver methods** → Specific userEvent calls
5. **Page navigation** → Component rendering with props
6. **Element selection by complex selectors** → data-testid based selection

## Key Differences to Remember

1. **No page navigation** - Use component rendering instead
2. **No driver pattern** - Use direct locator constants
3. **Focus required for keyboard** - Explicit focus calls needed
4. **userEvent API** - Different method signatures
5. **Locator indexing** - Use `.nth(index)` for multiple elements
6. **Component props** - Pass test scenarios via props instead of different pages

## Example Complete Conversion

**Before (Playwright):**
```typescript
test('checkbox can be toggled', async ({ page }) => {
  const d = await setup(page, "hero");
  await d.getTrigger().click();
  await expect(d.getIndicator()).toBeVisible();
});
```

**After (Vitest Browser):**
```typescript
test('checkbox can be toggled', async () => {
  render(<Basic />);
  await userEvent.click(Trigger);
  await expect.element(Indicator).toBeVisible();
});
```

## Implementation Steps

1. **Analyze existing `.test.ts` and `.driver.ts` files**
2. **Create component variations** for different test scenarios
3. **Set up locator constants** using data-testid pattern
4. **Convert test cases** one by one
5. **Update interactions** to use userEvent API
6. **Update assertions** to use Vitest browser format
7. **Test and validate** the conversion works correctly

Remember: Focus on maintaining the same test coverage and behavior while adapting to the Vitest browser testing patterns.