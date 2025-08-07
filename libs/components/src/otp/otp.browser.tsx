import { $, type PropsOf, component$, useSignal } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Otp } from "..";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Items = page.getByTestId("item");
const Input = page.getByTestId("input");
const ItemIndicators = page.getByTestId("item-indicator");

const Basic = component$((props: PropsOf<typeof Otp.Root>) => {
  return (
    <Otp.Root {...props} data-testid="root">
      <Otp.HiddenInput data-testid="input" />
      {Array.from({ length: 4 }, (num) => (
        <Otp.Item key={`item-${num}`} data-testid="item">
          <Otp.ItemIndicator data-testid="item-indicator" />
        </Otp.Item>
      ))}
    </Otp.Root>
  );
});

test("OTP control should be empty when rendered", async () => {
  render(<Basic />);
  await expect.element(Input).toHaveValue("");
});

test("typing numbers should update hidden input", async () => {
  render(<Basic />);

  // Focus the input first and use keyboard for typing
  await userEvent.click(Input);
  await userEvent.keyboard("1");
  await expect.element(Input).toHaveValue("1");

  await userEvent.keyboard("234");
  await expect.element(Input).toHaveValue("1234");
});

test("arrow left and typing should replace selected character", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("123");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");

  await userEvent.keyboard("1");
  await expect.element(Input).toHaveValue("121");
});

test("range selection should replace selected characters", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");

  await userEvent.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{/Shift}");

  await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");
  await expect.element(Items.nth(3)).toHaveAttribute("data-highlighted");

  await userEvent.keyboard("1");
  await expect.element(Input).toHaveValue("11");
});

test("full OTP typing new number should replace last character", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await userEvent.keyboard("5");
  await expect.element(Input).toHaveValue("1235");
});

test("select all and backspace should clear OTP", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");

  await userEvent.keyboard("{Meta>}a{/Meta}");
  await userEvent.keyboard("{Backspace}");
  await expect.element(Input).toHaveValue("");
});

test("arrow left navigation should select correct item", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");

  await userEvent.keyboard("{ArrowLeft}");
  await userEvent.keyboard("{ArrowLeft}");

  await expect.element(Items.nth(1)).toHaveAttribute("data-highlighted");
});

test("backspace should delete selected character", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");

  await userEvent.keyboard("{ArrowLeft}");
  await userEvent.keyboard("{Meta>}{Backspace}{/Meta}");

  await expect.element(Input).toHaveValue("124");
});

test("delete at end should remove last character", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");
  await userEvent.keyboard("{Delete}");
  await expect.element(Input).toHaveValue("123");
});

test("delete at beginning should remove first character", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await userEvent.keyboard("{Home}");
  await userEvent.keyboard("{Delete}");
  await expect.element(Input).toHaveValue("234");
});

test("delete in middle should remove character at cursor", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await userEvent.keyboard("{Home}");
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.keyboard("{Delete}");
  await expect.element(Input).toHaveValue("124");
});

test("invalid character should not change value", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("-");
  await expect.element(Items.nth(0)).toHaveAttribute("data-highlighted");
  await expect.element(Input).toHaveValue("");
});

test("inserting character between existing should update highlight", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("124");

  await userEvent.keyboard("{Home}");
  await userEvent.keyboard("{ArrowRight}");

  await userEvent.keyboard("3");

  await expect.element(Input).toHaveValue("134");
  await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");
});

test("backspace and arrow right should maintain highlight position", async () => {
  render(<Basic />);

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");

  await userEvent.keyboard("{Backspace}");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(Items.nth(2)).toHaveAttribute("data-highlighted");
});

const CompleteHandler = component$(() => {
  const isDisabled = useSignal(false);
  const handleComplete$ = $(() => {
    isDisabled.value = true;
  });

  return (
    <Otp.Root
      data-testid="root"
      onComplete$={handleComplete$}
      disabled={isDisabled.value}
    >
      <Otp.HiddenInput data-testid="input" />
      {Array.from({ length: 4 }, (num) => (
        <Otp.Item key={`item-${num}`} data-testid="item">
          <Otp.ItemIndicator data-testid="item-indicator" />
        </Otp.Item>
      ))}
    </Otp.Root>
  );
});

test("onComplete handler should be called when OTP is full", async () => {
  render(<CompleteHandler />);

  // Input should not be disabled initially
  await expect.element(Input).not.toBeDisabled();

  await userEvent.click(Input);
  await userEvent.keyboard("1234");
  await expect.element(Input).toHaveValue("1234");

  // we disable it in onComplete$
  await expect(Input).toBeDisabled();
});

const InitialValue = component$(() => {
  return (
    <Otp.Root data-testid="root" value="1234">
      <Otp.HiddenInput data-testid="input" />
      {Array.from({ length: 4 }, (num) => (
        <Otp.Item key={`item-${num}`} data-testid="item">
          <Otp.ItemIndicator data-testid="item-indicator" />
        </Otp.Item>
      ))}
    </Otp.Root>
  );
});

test("initial value should be displayed", async () => {
  render(<InitialValue />);
  await expect.element(Input).toHaveValue("1234");
});

const ReactiveValue = component$(() => {
  const otpValue = useSignal("");

  return (
    <div>
      <Otp.Root data-testid="root" bind:value={otpValue}>
        <Otp.HiddenInput data-testid="input" />
        {Array.from({ length: 4 }, (num) => (
          <Otp.Item key={`item-${num}`} data-testid="item">
            <Otp.ItemIndicator data-testid="item-indicator" />
          </Otp.Item>
        ))}
      </Otp.Root>
      <button
        type="button"
        data-testid="set-value"
        onClick$={() => (otpValue.value = "1234")}
      >
        Set Value
      </button>
    </div>
  );
});

test("reactive value changes should update OTP", async () => {
  render(<ReactiveValue />);

  await expect.element(Input).toHaveValue("");

  await userEvent.click(page.getByTestId("set-value"));
  await expect.element(Input).toHaveValue("1234");
});

const ChangeHandler = component$(() => {
  const hasChanged = useSignal(false);
  const handleChange$ = $(() => {
    hasChanged.value = true;
  });

  return (
    <div>
      <Otp.Root data-testid="root" onChange$={handleChange$}>
        <Otp.HiddenInput data-testid="input" />
        {Array.from({ length: 4 }, (num) => (
          <Otp.Item key={`item-${num}`} data-testid="item">
            <Otp.ItemIndicator data-testid="item-indicator" />
          </Otp.Item>
        ))}
      </Otp.Root>
      {hasChanged.value && <p>Value changed</p>}
    </div>
  );
});

test("onChange handler should be called when value changes", async () => {
  render(<ChangeHandler />);

  await userEvent.click(Input);
  await userEvent.keyboard("1");
  await expect.element(Input).toHaveValue("1");

  await expect.element(page.getByRole("paragraph")).toBeVisible();
});

const DisabledToggle = component$(() => {
  const isDisabled = useSignal(false);

  return (
    <div>
      <Otp.Root data-testid="root" disabled={isDisabled.value}>
        <Otp.HiddenInput data-testid="input" />
        {Array.from({ length: 4 }, (num) => (
          <Otp.Item key={`item-${num}`} data-testid="item">
            <Otp.ItemIndicator data-testid="item-indicator" />
          </Otp.Item>
        ))}
      </Otp.Root>
      <button
        type="button"
        data-testid="disable-toggle"
        onClick$={() => (isDisabled.value = true)}
      >
        Disable
      </button>
    </div>
  );
});

test("programmatic disable should make OTP non-interactive", async () => {
  render(<DisabledToggle />);

  await userEvent.click(page.getByTestId("disable-toggle"));
  await expect(Input).toBeDisabled();
});
