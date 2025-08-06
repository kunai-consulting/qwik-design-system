import { $, type PropsOf, component$, useSignal, useStore } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { RadioGroup } from "..";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Label = page.getByTestId("label");
const Description = page.getByTestId("description");
const Items = page.getByTestId("item");
const ItemLabels = page.getByTestId("item-label");
const Triggers = page.getByTestId("trigger");
const Indicators = page.getByTestId("indicator");
const HiddenInputs = page.getByTestId("hidden-input");
const Errors = page.getByTestId("error");

const Basic = component$((props: PropsOf<typeof RadioGroup.Root>) => {
  return (
    <RadioGroup.Root {...props} data-testid="root">
      <RadioGroup.Label data-testid="label">Choose option</RadioGroup.Label>
      {["Option 1", "Option 2", "Option 3", "Option 4"].map((value) => (
        <RadioGroup.Item value={value} key={value} data-testid="item">
          <RadioGroup.ItemLabel data-testid="item-label">{value}</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger data-testid="trigger">
            <RadioGroup.ItemIndicator data-testid="indicator">
              Indicator
            </RadioGroup.ItemIndicator>
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

/**
 *  TODO: We need StreamPause in qwik core to fix this
 *
 *  @see https://qwik.design/contributing/tradeoffs/
 */

// test("should meet axe accessibility requirements", async () => {
//   const screen = render(<Basic />);

//   await expect.element(Root).toBeVisible();

//   const results = await axe.run(screen.container);

//   expect(results.violations).toHaveLength(0);
// });

test("radio group role visible", async () => {
  render(<Basic />);
  await expect.element(Root).toBeVisible();
  await expect.element(Root).toHaveAttribute("role", "radiogroup");
});

test("first radio button can be clicked and checked", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(0)).toHaveAttribute("aria-checked", "true");
});

test("clicking different radio button unchecks previous", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");

  await userEvent.click(Triggers.nth(1));
  await expect.element(Triggers.nth(0)).not.toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(1)).toHaveAttribute("data-checked");
});

test("indicator should be visible when radio button is clicked", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await expect.element(Indicators.nth(0)).toBeVisible();
  await expect.element(Indicators.nth(0)).not.toHaveAttribute("data-hidden");
});

test("horizontal orientation keyboard navigation", async () => {
  render(<Basic orientation="horizontal" />);

  await userEvent.click(Triggers.nth(0));
  await userEvent.keyboard("{ArrowRight}");

  await expect.element(Triggers.nth(1)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(1)).toHaveAttribute("aria-checked", "true");
});

test("vertical orientation keyboard navigation", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await userEvent.keyboard("{ArrowDown}");

  await expect.element(Triggers.nth(1)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(1)).toHaveAttribute("aria-checked", "true");
});

test("Home key selects first item", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(3));
  await userEvent.keyboard("{Home}");

  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(0)).toHaveAttribute("aria-checked", "true");
});

test("End key selects last item", async () => {
  render(<Basic />);

  await userEvent.click(Triggers.nth(0));
  await userEvent.keyboard("{End}");

  await expect.element(Triggers.nth(3)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(3)).toHaveAttribute("aria-checked", "true");
});

test("Space key selects focused item", async () => {
  render(<Basic />);

  await expect.element(Triggers.nth(0)).toBeVisible();
  ((await Triggers.nth(0).element()) as HTMLButtonElement).focus();
  await userEvent.keyboard("{Space}");

  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(0)).toHaveAttribute("aria-checked", "true");
});

test("horizontal orientation attribute", async () => {
  render(<Basic orientation="horizontal" />);
  await expect.element(Root).toHaveAttribute("data-orientation", "horizontal");
});

test("disabled radio group prevents interaction", async () => {
  render(<Basic disabled />);
  await expect(Triggers.nth(0)).toBeDisabled();
});

test("radio group with initial value", async () => {
  render(<Basic value="Option 1" />);
  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");
});

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
      <RadioGroup.Root
        required
        name="subscription"
        data-testid="root"
        onChange$={() => {
          isError.value = false;
        }}
      >
        <RadioGroup.Label data-testid="label">Subscription Plan</RadioGroup.Label>
        <RadioGroup.Description data-testid="description">
          Choose your preferred subscription plan
        </RadioGroup.Description>

        {["Basic", "Pro"].map((item) => (
          <RadioGroup.Item value={item} key={item} data-testid="item">
            <RadioGroup.ItemLabel data-testid="item-label">{item}</RadioGroup.ItemLabel>
            <RadioGroup.ItemTrigger data-testid="trigger">
              <RadioGroup.ItemIndicator data-testid="indicator">
                Indicator
              </RadioGroup.ItemIndicator>
            </RadioGroup.ItemTrigger>
            <RadioGroup.HiddenInput data-testid="hidden-input" />
          </RadioGroup.Item>
        ))}

        {isError.value && (
          <RadioGroup.Error data-testid="error">
            Please select a subscription plan
          </RadioGroup.Error>
        )}
      </RadioGroup.Root>

      <button type="submit">Subscribe</button>
    </form>
  );
});

test("form integration - error message shows when required and not selected", async () => {
  render(<FormBasic />);

  await userEvent.click(page.getByText("Subscribe"));
  await expect.element(Errors).toBeVisible();
});

test("form integration - error clears when option selected", async () => {
  render(<FormBasic />);

  await userEvent.click(page.getByText("Subscribe"));
  await expect.element(Errors).toBeVisible();

  await userEvent.click(Triggers.nth(0));
  await expect.element(Errors).not.toBeInTheDocument();
});

test("required attribute present", async () => {
  render(<FormBasic />);

  await expect.element(Root).toHaveAttribute("aria-required", "true");
});

test("description linked properly", async () => {
  render(<FormBasic />);

  await expect.element(Root).toHaveAttribute("aria-describedby");
});

test("aria-labelledby attribute present when label exists", async () => {
  render(<FormBasic />);
  await expect.element(Root).toHaveAttribute("aria-labelledby");
});

const OneDisabledItem = component$(() => {
  return (
    <RadioGroup.Root data-testid="root">
      <RadioGroup.Label data-testid="label">Choose option</RadioGroup.Label>
      {["Option 1", "Option 2", "Option 3", "Option 4"].map((value, index) => (
        <RadioGroup.Item value={value} key={value} data-testid="item">
          <RadioGroup.ItemLabel data-testid="item-label">{value}</RadioGroup.ItemLabel>
          <RadioGroup.ItemTrigger data-testid="trigger" disabled={index === 1}>
            <RadioGroup.ItemIndicator data-testid="indicator">
              Indicator
            </RadioGroup.ItemIndicator>
          </RadioGroup.ItemTrigger>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

test("disabled items navigation - should skip disabled items", async () => {
  render(<OneDisabledItem />);

  await expect.element(Triggers.nth(0)).toBeVisible();
  await ((await Triggers.nth(0).element()) as HTMLButtonElement)?.focus();
  await userEvent.keyboard("{ArrowDown}");

  await expect.element(Triggers.nth(2)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(1)).toHaveAttribute("data-disabled");
});

const ExternalState = component$(() => {
  const selectedSignal = useSignal("Option 1");
  const selectedStore = useStore({ item: "Option 1" });

  return (
    <div>
      <RadioGroup.Root
        data-testid="root"
        // test signal
        bind:value={selectedSignal}
        // test value based
        value={selectedStore.item}
        onChange$={(newValue) => {
          selectedStore.item = newValue;
        }}
      >
        <RadioGroup.Label data-testid="label">Choose option</RadioGroup.Label>
        {["Option 1", "Option 2", "Option 3"].map((option) => (
          <RadioGroup.Item value={option} key={option} data-testid="item">
            <RadioGroup.ItemLabel data-testid="item-label">{option}</RadioGroup.ItemLabel>
            <RadioGroup.ItemTrigger data-testid="trigger">
              <RadioGroup.ItemIndicator data-testid="indicator">
                Indicator
              </RadioGroup.ItemIndicator>
            </RadioGroup.ItemTrigger>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <button
        type="button"
        data-testid="change-value"
        onClick$={() => (selectedStore.item = "Option 2")}
      >
        Change to Option 2
      </button>

      <button
        type="button"
        data-testid="change-signal"
        onClick$={() => (selectedSignal.value = "Option 3")}
      >
        Change to Option 3
      </button>
    </div>
  );
});

test("external value changes update selection", async () => {
  render(<ExternalState />);

  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");

  await userEvent.click(page.getByTestId("change-value"));

  await expect.element(Triggers.nth(1)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(0)).not.toHaveAttribute("data-checked");
});

test("external store changes update selection", async () => {
  render(<ExternalState />);

  await expect.element(Triggers.nth(0)).toHaveAttribute("data-checked");

  await userEvent.click(page.getByTestId("change-signal"));

  await expect.element(Triggers.nth(2)).toHaveAttribute("data-checked");
  await expect.element(Triggers.nth(0)).not.toHaveAttribute("data-checked");
});
