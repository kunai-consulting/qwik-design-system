import { $, component$, useComputed$, useSignal } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Checkbox } from "..";
import type { PublicCheckboxRootProps } from "./checkbox-root";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Trigger = page.getByTestId("trigger");
const Indicators = page.getByTestId("indicator");
const Label = page.getByTestId("label");
const CheckboxError = page.getByTestId("checkbox-error");
const HiddenInput = page.getByTestId("hidden-input");
const ReadState = page.getByTestId("read-state");
const ProgrammaticButton = page.getByTestId("programmatic-button");
const TimesChanged = page.getByTestId("times-changed");
const NewValue = page.getByTestId("new-value");
const ToggleDisabledButton = page.getByTestId("toggle-disabled-button");
const MakeMixedButton = page.getByTestId("make-mixed-button");
const SubmitButton = page.getByTestId("submit-button");
const Submitted = page.getByTestId("submitted");

const BasicCheckbox = component$(
  (props: PublicCheckboxRootProps & { isDisabled?: boolean }) => {
    const disabledOverride = useSignal<boolean | undefined>(undefined);

    return (
      <>
        <Checkbox.Root
          {...props}
          disabled={
            disabledOverride.value !== undefined ? disabledOverride.value : props.disabled
          }
          data-testid="root"
        >
          <Checkbox.Trigger data-testid="trigger">
            <Checkbox.Indicator data-testid="indicator">Checked</Checkbox.Indicator>
          </Checkbox.Trigger>
          <Checkbox.Label data-testid="label">Checkbox Label</Checkbox.Label>
        </Checkbox.Root>

        {props.isDisabled && (
          <button
            type="button"
            data-testid="toggle-disabled-button"
            onClick$={() => {
              disabledOverride.value =
                disabledOverride.value === undefined
                  ? !props.disabled
                  : !disabledOverride.value;
            }}
          >
            Toggle disabled state
          </button>
        )}
      </>
    );
  }
);

const BasicCheckboxWithBindChecked = component$(
  (
    props: PublicCheckboxRootProps & {
      isProgrammatic?: boolean;
      isChecked?: boolean | "mixed";
      isMixed?: boolean;
    }
  ) => {
    const isChecked = useSignal<boolean | "mixed">(props.isChecked ?? false);

    return (
      <>
        <Checkbox.Root {...props} bind:checked={isChecked} data-testid="root">
          <Checkbox.Trigger data-testid="trigger">
            <Checkbox.Indicator data-testid="indicator">
              {isChecked.value === "mixed" ? "-" : "Checked"}
            </Checkbox.Indicator>
          </Checkbox.Trigger>
        </Checkbox.Root>

        {props.isProgrammatic ? (
          <button
            type="button"
            data-testid="programmatic-button"
            onClick$={() => {
              isChecked.value = true;
            }}
          >
            I check the checkbox above
          </button>
        ) : props.isMixed ? (
          <button
            type="button"
            data-testid="make-mixed-button"
            onClick$={() => {
              isChecked.value = "mixed";
            }}
          >
            Make the checkbox mixed
          </button>
        ) : (
          <p data-testid="read-state">
            Checked:{" "}
            {isChecked.value === "mixed" ? "mixed" : isChecked.value ? "true" : "false"}
          </p>
        )}
      </>
    );
  }
);

const BasicCheckboxWithOnChange = component$((props: PublicCheckboxRootProps) => {
  const numChanges = useSignal(0);
  const isChecked = useSignal(false);
  const handleChange$ = $((checked: boolean) => {
    numChanges.value++;
    isChecked.value = checked;
  });

  return (
    <>
      <Checkbox.Root {...props} data-testid="root" onChange$={handleChange$}>
        <Checkbox.Trigger data-testid="trigger">
          <Checkbox.Indicator data-testid="indicator">Checked</Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>
      <p data-testid="times-changed">Times changed: {numChanges.value}</p>
      <section data-testid="new-value">
        New value: {isChecked.value ? "true" : "false"}
      </section>
    </>
  );
});

const BasicForm = component$((props: PublicCheckboxRootProps) => {
  const formData = useSignal<Record<string, FormDataEntryValue>>();

  return (
    <form
      preventdefault:submit
      noValidate
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        formData.value = Object.fromEntries(new FormData(form));
      }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <Checkbox.Root name="terms" data-testid="root" {...props}>
        <Checkbox.HiddenInput data-testid="hidden-input" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Checkbox.Trigger data-testid="trigger">
            <Checkbox.Indicator data-testid="indicator">Checked</Checkbox.Indicator>
          </Checkbox.Trigger>
          <Checkbox.Label data-testid="label">
            I accept the Terms and Conditions
          </Checkbox.Label>
        </div>
      </Checkbox.Root>
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
      {formData.value && (
        <div data-testid="submitted">
          Submitted: {JSON.stringify(formData.value, null, 2)}
        </div>
      )}
    </form>
  );
});

const BasicFormWithMixed = component$(
  (
    props: PublicCheckboxRootProps & { isMixed?: boolean; isChecked?: boolean | "mixed" }
  ) => {
    const isChecked = useSignal<boolean | "mixed">(props.isChecked ?? false);

    const formData = useSignal<Record<string, FormDataEntryValue>>();
    const handleSubmit$ = $((e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const formDataInstance = new FormData(form);
      const result: Record<string, FormDataEntryValue> = {};
      formDataInstance.forEach((value, key) => {
        result[key] = value;
      });
      formData.value = result;
    });

    return (
      <form
        preventdefault:submit
        onSubmit$={handleSubmit$}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <Checkbox.Root
          name="terms"
          data-testid="root"
          {...props}
          bind:checked={isChecked}
        >
          <Checkbox.HiddenInput data-testid="hidden-input" />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox.Trigger data-testid="trigger">
              <Checkbox.Indicator data-testid="indicator">Checked</Checkbox.Indicator>
            </Checkbox.Trigger>
            <Checkbox.Label>I accept the Terms and Conditions</Checkbox.Label>
          </div>
        </Checkbox.Root>
        <button
          data-testid="make-mixed-button"
          onClick$={() => {
            isChecked.value = "mixed";
          }}
          type="button"
        >
          Make it mixed
        </button>
      </form>
    );
  }
);

const BasicFormWithValidation = component$((props: PublicCheckboxRootProps) => {
  const formData = useSignal<Record<string, FormDataEntryValue>>();
  const isChecked = useSignal(false);
  const isSubmitAttempt = useSignal(false);
  const isError = useComputed$(() => !isChecked.value && isSubmitAttempt.value);

  return (
    <form
      preventdefault:submit
      noValidate
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        if (!isChecked.value) {
          isSubmitAttempt.value = true;
          return;
        }

        formData.value = Object.fromEntries(new FormData(form));
      }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <Checkbox.Root name="terms" required bind:checked={isChecked} data-testid="root">
        <Checkbox.HiddenInput data-testid="hidden-input" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px"
          }}
        >
          <Checkbox.Trigger data-testid="trigger">
            <Checkbox.Indicator data-testid="indicator">Checked</Checkbox.Indicator>
          </Checkbox.Trigger>
          <Checkbox.Label data-testid="label">
            I accept the Terms and Conditions
          </Checkbox.Label>
        </div>
        {isError.value && (
          <Checkbox.Error data-testid="checkbox-error" style={{ color: "red" }}>
            Please accept the terms and conditions
          </Checkbox.Error>
        )}
      </Checkbox.Root>
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
      {formData.value && (
        <div data-testid="submitted">
          Submitted: {JSON.stringify(formData.value, null, 2)}
        </div>
      )}
    </form>
  );
});

test("should show indicator when clicked", async () => {
  render(<BasicCheckbox />);

  await userEvent.click(Trigger);

  await expect.element(Indicators).toBeVisible();
});

test("should hide indicator when unchecked", async () => {
  render(<BasicCheckbox checked />);

  await userEvent.click(Trigger);

  await expect.element(Indicators).not.toBeVisible();
});

test("should toggle with space key when focused", async () => {
  render(<BasicCheckbox />);

  await expect.element(Trigger).toBeVisible();

  const trigger = Trigger.element() as HTMLElement;
  trigger.focus();

  await expect.element(Trigger).toHaveFocus();

  await userEvent.keyboard("{Space}");
  await expect.element(Indicators).toBeVisible();
});

test("should be checked when checked prop is true", async () => {
  render(<BasicCheckbox checked />);

  await expect.element(Indicators).toBeVisible();
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");
});

test("should update bind:checked state when clicked", async () => {
  render(<BasicCheckboxWithBindChecked />);

  await userEvent.click(Trigger);
  await expect.element(Indicators).toBeVisible();
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");
  await expect.element(ReadState).toHaveTextContent("Checked: true");
});

test("should toggle bind:checked state from checked to unchecked", async () => {
  render(<BasicCheckboxWithBindChecked isProgrammatic={false} />);

  // initial setup
  await userEvent.click(Trigger);
  await expect.element(Indicators).toBeVisible();
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");
  await expect.element(ReadState).toHaveTextContent("Checked: true");

  await userEvent.click(Trigger);
  await expect.element(ReadState).toHaveTextContent("Checked: false");
});

test("should update when bind:checked signal changes programmatically", async () => {
  render(<BasicCheckboxWithBindChecked isProgrammatic={true} />);

  await expect.element(Indicators).not.toBeVisible();

  await userEvent.click(ProgrammaticButton);
  await expect.element(Indicators).toBeVisible();
});

test("should call onChange$ handler when toggled", async () => {
  render(<BasicCheckboxWithOnChange />);

  await expect.element(TimesChanged).toHaveTextContent("Times changed: 0");
  await userEvent.click(Trigger);
  await expect.element(TimesChanged).toHaveTextContent("Times changed: 1");
});

test("should pass new value to onChange$ handler", async () => {
  render(<BasicCheckboxWithOnChange />);

  await expect.element(NewValue).toHaveTextContent("New value: false");
  await userEvent.click(Trigger);
  await expect.element(NewValue).toHaveTextContent("New value: true");
});

test("should be disabled when disabled prop is true", async () => {
  render(<BasicCheckbox disabled />);

  await expect.element(Trigger).toBeDisabled();
});

test("should toggle disabled state programmatically", async () => {
  render(<BasicCheckbox disabled isDisabled={true} />);

  await expect.element(Trigger).toBeDisabled();

  await userEvent.click(ToggleDisabledButton);
  await expect.element(Trigger).toBeEnabled();
});

test("should support mixed state", async () => {
  render(<BasicCheckboxWithBindChecked isMixed={true} />);

  await expect.element(Trigger).toHaveAttribute("aria-checked", "false");

  await userEvent.click(MakeMixedButton);

  await expect.element(Trigger).toHaveAttribute("aria-checked", "mixed");
});

test("should set aria-checked to true when clicked", async () => {
  render(<BasicCheckbox />);

  await userEvent.click(Trigger);
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");
});

test("should set aria-checked to false when unchecked", async () => {
  render(<BasicCheckbox checked />);

  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");

  await userEvent.click(Trigger);
  await expect.element(Trigger).toHaveAttribute("aria-checked", "false");
});

test("should connect label to trigger with proper attributes", async () => {
  render(<BasicCheckbox />);

  // Wait for the trigger to be visible first
  await expect.element(Trigger).toBeVisible();

  // Now get the DOM elements
  const triggerElements = await Trigger.elements();
  const triggerId = triggerElements[0]?.id;

  expect(triggerId).toBeTruthy();
  await expect.element(Label).toHaveAttribute("for", triggerId as string);
});

test("should toggle when label is clicked", async () => {
  render(<BasicCheckbox />);

  await userEvent.click(Label);
  await expect.element(Indicators).toBeVisible();
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");
});

test("should uncheck when label is clicked on checked checkbox", async () => {
  render(<BasicCheckbox checked />);

  await userEvent.click(Label);
  await expect.element(Indicators).not.toBeVisible();
  await expect.element(Trigger).toHaveAttribute("aria-checked", "false");
});

test("should display mixed state correctly", async () => {
  render(<BasicCheckboxWithBindChecked isMixed={true} isChecked="mixed" />);

  await expect.element(Trigger).toHaveAttribute("aria-checked", "mixed");
});

test("should transition from mixed to checked when clicked", async () => {
  render(<BasicCheckboxWithBindChecked isMixed={true} isChecked="mixed" />);

  await expect.element(Trigger).toHaveAttribute("aria-checked", "mixed");

  await userEvent.click(Trigger);
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");
  await expect.element(Indicators).toBeVisible();
});

test("should transition from checked to unchecked after mixed state", async () => {
  render(<BasicCheckboxWithBindChecked isMixed={true} isChecked="mixed" />);

  // Get to checked state first
  await userEvent.click(Trigger);
  await expect.element(Trigger).toHaveAttribute("aria-checked", "true");

  // Now click again
  await userEvent.click(Trigger);
  await expect.element(Trigger).toHaveAttribute("aria-checked", "false");
  await expect.element(Indicators).not.toBeVisible();
});

test("should render hidden input in forms", async () => {
  render(<BasicForm />);

  await expect.element(HiddenInput).toBeVisible();
});

test("should sync hidden input state when checked", async () => {
  render(<BasicForm />);

  await userEvent.click(Trigger);
  await expect.element(HiddenInput).toBeChecked();
});

test("should sync hidden input state when unchecked", async () => {
  render(<BasicForm checked />);

  await expect.element(HiddenInput).toBeChecked();

  await userEvent.click(Trigger);
  await expect.element(HiddenInput).not.toBeChecked();
});

test("should set hidden input as indeterminate in mixed state", async () => {
  render(<BasicFormWithMixed isMixed={true} isChecked="mixed" />);

  await userEvent.click(MakeMixedButton);
  await expect.element(HiddenInput).toHaveAttribute("indeterminate");
});

test("should submit form when checked", async () => {
  render(<BasicForm checked />);

  await userEvent.click(SubmitButton);
  await expect.element(Submitted).toBeVisible();
});

test("should submit empty form data when unchecked", async () => {
  render(<BasicForm />);

  await userEvent.click(SubmitButton);
  await expect.element(Submitted).toHaveTextContent("Submitted: {}");
});

test("should display error message when unchecked", async () => {
  render(<BasicFormWithValidation />);

  await userEvent.click(SubmitButton);
  await expect.element(CheckboxError).toBeVisible();
  await expect.element(Trigger).toHaveAttribute("aria-invalid", "true");
  // TODO: add test for aria-describedby
  // await expect.element(Trigger).toHaveAttribute("aria-describedby");
});

test(`should submit checkbox with custom value "checked" in form`, async () => {
  render(<BasicForm value="checked" />);

  await userEvent.click(Trigger);
  await expect(HiddenInput).toBeChecked();
  await userEvent.click(SubmitButton);
  await expect(Submitted).toHaveTextContent(`Submitted: { "terms": "checked" }`);
});
