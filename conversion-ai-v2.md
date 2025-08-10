# Playwright to Vitest Browser API Conversion Guide v2

## Overview

This guide helps convert Playwright test files (`.test.ts`) and their corresponding driver files (`.driver.ts`) to use the Vitest Browser API format. The conversion maintains the same testing patterns while adapting to the Vitest browser testing environment.

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
const Root = page.getByTestId("root");
const Items = page.getByTestId("item");
const Input = page.getByTestId("input");
const Triggers = page.getByTestId("trigger");
const Indicators = page.getByTestId("indicator");
const Labels = page.getByTestId("label");
const Errors = page.getByTestId("error");
```

## Core Conversion Patterns

### 1. Driver Function Elimination
**From Playwright Driver:**
```typescript
export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getTrigger = () => rootLocator.locator("[data-qds-component-trigger]");
  const getTriggerAt = (index: number) => getTrigger().nth(index);
  return { getTrigger, getTriggerAt };
}
```

**To Direct Locators:**
```typescript
const Triggers = page.getByTestId("trigger");
```

### 2. Test Setup Simplification
**From Playwright:**
```typescript
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/component/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test(`GIVEN a component WHEN action THEN result`, async ({ page }) => {
  const d = await setup(page, "hero");
});
```

**To Direct Rendering:**
```typescript
test("simple descriptive name", async () => {
  render(<Basic />);
});
```

## User Interaction Patterns

### Click Events
```typescript
await userEvent.click(Triggers.nth(0));
await userEvent.click(Input);
await userEvent.click(page.getByText("Submit"));
```

### Keyboard Input (Text)
```typescript
await userEvent.click(Input);
await userEvent.keyboard("1234");

await userEvent.keyboard("1");
await userEvent.keyboard("234");
```

### Keyboard Navigation
```typescript
await userEvent.keyboard("{ArrowLeft}");
await userEvent.keyboard("{ArrowRight}");
await userEvent.keyboard("{ArrowDown}");
await userEvent.keyboard("{ArrowUp}");

await userEvent.keyboard("{Home}");
await userEvent.keyboard("{End}");

await userEvent.keyboard("{Backspace}");
await userEvent.keyboard("{Delete}");
await userEvent.keyboard("{Space}");
```

### Complex Keyboard Combinations
```typescript
await userEvent.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{/Shift}");

await userEvent.keyboard("{Meta>}a{/Meta}");
await userEvent.keyboard("{Meta>}{Backspace}{/Meta}");

await userEvent.keyboard("{Home}");
await userEvent.keyboard("{ArrowRight}");
await userEvent.keyboard("3");
```

### Focus Management
Most interactions don't require explicit focus management. Just click first:
```typescript
await userEvent.click(Input);
await userEvent.keyboard("1234");

await expect.element(Triggers.nth(0)).toBeVisible();
((await Triggers.nth(0).element()) as HTMLButtonElement).focus();
await userEvent.keyboard("{Space}");
```

## Assertion Patterns

### Element Visibility and State
```typescript
await expect.element(Root).toBeVisible();
await expect.element(Indicators.nth(0)).toBeVisible();
await expect(Triggers.nth(0)).toBeDisabled();
await expect.element(Input).not.toBeDisabled();
```

### Attributes and Data States
```typescript
await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");
await expect.element(Root).toHaveAttribute("data-disabled");
await expect.element(Triggers.nth(0)).not.toHaveAttribute("data-checked");

await expect.element(Triggers.nth(0)).toHaveAttribute("aria-checked", "true");
await expect.element(Root).toHaveAttribute("aria-required", "true");
await expect.element(Root).toHaveAttribute("aria-labelledby");
```

### Input Values
```typescript
await expect.element(Input).toHaveValue("1234");
await expect.element(Input).toHaveValue("");
```

### DOM Presence
```typescript
await expect.element(Errors).toBeVisible();
await expect.element(Errors).not.toBeInTheDocument();
```

## Component Creation Patterns

### Basic Component Template (Always use this first)
**ALWAYS** name the main test component `Basic` and spread props to the root:
```typescript
const Basic = component$((props: PropsOf<typeof ComponentName.Root>) => {
  return (
    <ComponentName.Root {...props} data-testid="root">
      <ComponentName.Label data-testid="label">Choose option</ComponentName.Label>
      {["Option 1", "Option 2", "Option 3"].map((value) => (
        <ComponentName.Item value={value} key={value} data-testid="item">
          <ComponentName.ItemLabel data-testid="item-label">{value}</ComponentName.ItemLabel>
          <ComponentName.ItemTrigger data-testid="trigger">
            <ComponentName.ItemIndicator data-testid="indicator">
              Indicator
            </ComponentName.ItemIndicator>
          </ComponentName.ItemTrigger>
        </ComponentName.Item>
      ))}
    </ComponentName.Root>
  );
});
```

**Use the Basic component for most tests by passing props:**
```typescript
test("disabled component prevents interaction", async () => {
  render(<Basic disabled />);
  await expect(Triggers.nth(0)).toBeDisabled();
});

test("component with initial value", async () => {
  render(<Basic value="Option 1" />);
  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
});

test("horizontal orientation", async () => {
  render(<Basic orientation="horizontal" />);
  await expect.element(Root).toHaveAttribute("data-orientation", "horizontal");
});
```

### Input Component Template (OTP-style)
```typescript
const Basic = component$((props: PropsOf<typeof Otp.Root>) => {
  const slots = [...Array(4).keys()];
  return (
    <Otp.Root {...props} data-testid="root">
      <Otp.HiddenInput data-testid="input" />
      {slots.map((slot) => (
        <Otp.Item key={slot} data-testid="item">
          <Otp.ItemIndicator data-testid="item-indicator">Indicator</Otp.ItemIndicator>
        </Otp.Item>
      ))}
    </Otp.Root>
  );
});
```

### Event Handler Component
```typescript
const CompleteHandler = component$(() => {
  const isDisabled = useSignal(false);
  const handleComplete$ = $(() => {
    isDisabled.value = true;
  });

  return (
    <ComponentName.Root
      data-testid="root"
      onComplete$={handleComplete$}
      disabled={isDisabled.value}
    >
      <ComponentName.HiddenInput data-testid="input" />
    </ComponentName.Root>
  );
});
```

### Form Integration Component
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
        <ComponentName.Label data-testid="label">Field Label</ComponentName.Label>
        
        {isError.value && (
          <ComponentName.Error data-testid="error">
            Please select an option
          </ComponentName.Error>
        )}
      </ComponentName.Root>
      <button type="submit">Submit</button>
    </form>
  );
});
```

### External State Component (ONLY when testing external state)
**ALWAYS** name external state components `ExternalState`. Use both signal and store patterns:
```typescript
const ExternalState = component$(() => {
  const selectedSignal = useSignal("1234");
  const selectedStore = useStore({ item: "1234" });

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
        <ComponentName.HiddenInput data-testid="input" />
      </ComponentName.Root>
      
      <button
        type="button"
        data-testid="change-value"
        onClick$={() => (selectedStore.item = "5678")}
      >
        Change to 5678
      </button>

      <button
        type="button"
        data-testid="change-signal"
        onClick$={() => (selectedSignal.value = "9012")}
      >
        Change to 9012
      </button>
    </div>
  );
});
```

**Standard External State Tests:**
```typescript
test("external value changes update selection", async () => {
  render(<ExternalState />);

  await expect.element(Input).toHaveValue("1234");

  await userEvent.click(page.getByTestId("change-value"));

  await expect.element(Input).toHaveValue("5678");
});

test("external signal changes update selection", async () => {
  render(<ExternalState />);

  await expect.element(Input).toHaveValue("1234");

  await userEvent.click(page.getByTestId("change-signal"));

  await expect.element(Input).toHaveValue("9012");
});
```

## When to Create New Components vs Using Basic

### Use Basic Component for:
- Simple prop testing (disabled, orientation, value, etc.)
- Basic interaction testing
- Most keyboard navigation tests
- State attribute testing
- Any test that can be achieved by passing props

### Only Create New Components for:
- **Form integration** - Need form wrapper and validation logic
- **Event handlers** - Need custom state and handler setup  
- **External state** - Need signals and stores (use `ExternalState`)
- **Complex scenarios** - Multiple interacting elements that can't be achieved with props

### Component Naming Convention:
- `Basic` - Main component with props spread
- `ExternalState` - External state management testing
- `FormBasic` - Form integration testing
- `CompleteHandler` - Event handler testing
- `OneDisabledItem` - Specific scenario that requires custom setup

## Test Naming and Organization

### Use Simple, Descriptive Names
```typescript
test("typing numbers should update hidden input", async () => {
test("arrow left and typing should replace selected character", async () => {
test("external value changes update selection", async () => {
test("disabled items navigation - should skip disabled items", async () => {

test(`GIVEN an OTP control WHEN typing a number THEN the hidden input should be updated`, async () => {
```

### Remove Unnecessary Grouping
Only group tests when absolutely necessary for setup/teardown:
```typescript
test.describe("form integration", () => {
  
});

test("form integration - error message shows when required and not selected", async () => {
test("form integration - error clears when option selected", async () => {
```

## External State Testing Pattern

The `ExternalState` component must test BOTH signal-based and value-based state management:

**Signal-based state:** Uses `bind:value={selectedSignal}` and updates `selectedSignal.value`
**Value-based state:** Uses `value={selectedStore.item}` with `onChange$` and updates `selectedStore.item`

```typescript
test("external value changes update selection", async () => {
  render(<ExternalState />);

  await expect.element(Input).toHaveValue("1234");

  await userEvent.click(page.getByTestId("change-value"));

  await expect.element(Input).toHaveValue("5678");
});

test("external signal changes update selection", async () => {
  render(<ExternalState />);

  await expect.element(Input).toHaveValue("1234");

  await userEvent.click(page.getByTestId("change-signal"));

  await expect.element(Input).toHaveValue("9012");
});
```

## Multiple Element Selection

Use `.nth()` for selecting from multiple similar elements:
```typescript
const Items = page.getByTestId("item");
const Triggers = page.getByTestId("trigger");

await userEvent.click(Triggers.nth(0));
await expect.element(Triggers.nth(1)).not.toHaveAttribute("data-checked");
await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");
```

## Common Conversion Examples

### Radio Group Selection
**Before (Playwright):**
```typescript
test(`radio button selection`, async ({ page }) => {
  const d = await setup(page, "hero");
  await d.getTriggerAt(0).click();
  await expect(d.getTriggerAt(0)).toHaveAttribute("data-checked");
});
```

**After (Vitest):**
```typescript
test("first radio button can be clicked and checked", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
});
```

### Complex Input Interaction
**Before (Playwright):**
```typescript
test(`OTP character replacement`, async ({ page }) => {
  const d = await setup(page, "hero");
  const input = d.getInput();
  await input.pressSequentially("123");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.insertText("1");
  await expect(input).toHaveValue("121");
});
```

**After (Vitest):**
```typescript
test("arrow left and typing should replace selected character", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("123");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");

  await userEvent.keyboard("1");
  await expect.element(Input).toHaveValue("121");
});
```

## Key Implementation Steps

1. **Eliminate driver pattern** - Replace with direct locator constants
2. **Simplify test setup** - Use `render()` instead of page navigation
3. **Update interactions** - Use `userEvent` API consistently
4. **Streamline assertions** - Use `expect.element()` for elements, `expect()` for inputs
5. **Create component variations** - Build test scenarios as components, not separate pages
6. **Focus on behavior** - Test component API and user interactions directly

## CRITICAL: No Comments in Generated Code

**DO NOT generate any comments in the converted code.** This includes:
- No `// comment` style comments
- No `{/* comment */}` JSX comments
- No explanatory comments in code blocks
- No TODO comments
- No descriptive comments

Write clean, comment-free code that is self-explanatory through good naming and structure.

## Tips for Success

- **Start with simple tests** and gradually add complexity
- **Use data-testid consistently** for reliable element selection
- **Test external state management** with dedicated components
- **Keep test names descriptive** but concise
- **Focus on user behavior** rather than implementation details
- **Leverage component props** instead of multiple test pages
- **Test keyboard interactions thoroughly** - they're often the most complex