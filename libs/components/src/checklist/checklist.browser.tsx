import { $, type PropsOf, component$, useSignal } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Checklist } from "..";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const MainTrigger = page.getByTestId("main-trigger");
const MainIndicator = page.getByTestId("main-indicator");
const MainLabel = page.getByTestId("main-label");
const Triggers = page.getByTestId("trigger");
const Indicators = page.getByTestId("indicator");
const Labels = page.getByTestId("label");
const Items = page.getByTestId("item");
const SubmitButton = page.getByTestId("submit-button");
const SubmittedData = page.getByTestId("submitted-data");

// Component for Select All tests
const SelectAllExample = component$((props: PropsOf<typeof Checklist.Root>) => {
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <Checklist.Root {...props} data-testid="root">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checklist.SelectAll data-testid="main-trigger">
          <Checklist.SelectAllIndicator data-testid="main-indicator">
            <span data-check-icon>Checked</span>
            <span data-minus-icon>-</span>
          </Checklist.SelectAllIndicator>
        </Checklist.SelectAll>
        <Checklist.Label data-testid="main-label">All items</Checklist.Label>
      </div>
      <div style={{ marginLeft: "32px" }}>
        {items.map((item, index) => (
          <Checklist.Item
            style={{ marginBottom: "8px", marginTop: "8px" }}
            data-testid="item"
            key={item}
          >
            <Checklist.ItemTrigger data-testid="trigger">
              <Checklist.ItemIndicator data-testid="indicator">
                <span>Checked</span>
              </Checklist.ItemIndicator>
            </Checklist.ItemTrigger>
            <Checklist.ItemLabel data-testid="label">{item}</Checklist.ItemLabel>
          </Checklist.Item>
        ))}
      </div>
    </Checklist.Root>
  );
});

// Component for Form tests
const FormExample = component$(() => {
  const formData = useSignal<Record<string, FormDataEntryValue>>();

  const handleSubmit$ = $((e: SubmitEvent) => {
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const result: Record<string, FormDataEntryValue> = {};
    data.forEach((value, key) => {
      result[key] = value;
    });
    formData.value = result;
  });

  const topics = [
    { label: "News", value: "news" },
    { label: "Events", value: "events" },
    { label: "Fashion", value: "fashion" }
  ];

  return (
    <form preventdefault:submit onSubmit$={handleSubmit$}>
      <Checklist.Root data-testid="root">
        {topics.map((topic) => (
          <Checklist.Item data-testid="item" key={topic.value} name={topic.value}>
            <Checklist.HiddenInput name={topic.value} />
            <Checklist.ItemTrigger data-testid="trigger">
              <Checklist.ItemIndicator data-testid="indicator">
                <span>Checked</span>
              </Checklist.ItemIndicator>
            </Checklist.ItemTrigger>
            <Checklist.ItemLabel data-testid="label">{topic.label}</Checklist.ItemLabel>
          </Checklist.Item>
        ))}
      </Checklist.Root>
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
      {formData.value && (
        <div data-testid="submitted-data">{JSON.stringify(formData.value)}</div>
      )}
    </form>
  );
});

// Helper function to verify all checkbox states
async function verifyAllCheckboxStates(checked: boolean) {
  for (let i = 0; i < 4; i++) {
    await expect
      .element(Triggers.nth(i))
      .toHaveAttribute("aria-checked", checked ? "true" : "false");
    if (checked) {
      await expect.element(Indicators.nth(i)).toBeVisible();
    } else {
      await expect.element(Indicators.nth(i)).not.toBeVisible();
    }
  }
}

// Helper function to perform action on all checkboxes
async function allCheckboxes(action: "click" | { key: string }) {
  for (let i = 0; i < 4; i++) {
    if (typeof action === "string" && action === "click") {
      await userEvent.click(Triggers.nth(i));
    } else if ("key" in action) {
      await expect.element(Triggers.nth(i)).toBeVisible();
      ((await Triggers.nth(i).element()) as HTMLButtonElement).focus();
      await userEvent.keyboard(`{${action.key}}`);
    }
  }
}

test("main checkbox is unchecked when no items are checked", async () => {
  render(<SelectAllExample />);
  await expect.element(MainIndicator).not.toBeVisible();
  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "false");
});

test("main checkbox is partially checked when some items are checked", async () => {
  render(<SelectAllExample />);

  await expect.element(MainIndicator).toBeVisible();
  await expect.element(Indicators.nth(0)).toBeVisible();

  // Click the first checkbox
  await userEvent.click(Triggers.nth(0));

  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "mixed");
});

test("main checkbox is checked when all items are checked", async () => {
  render(<SelectAllExample />);

  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "false");

  await allCheckboxes("click");
  await verifyAllCheckboxStates(true);

  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "true");
  await expect.element(MainIndicator).toBeVisible();
});

// FAILING TEST DUE TO QWIK V2 BUG
// Bug: Interactive element does not update multiple array items; only one item toggles per click
// Reproduction: https://github.com/ToanTrinh01/v2-synchronized-repo
// Issue: https://github.com/QwikDev/qwik/issues/7795
test("clicking main checkbox checks all items", async () => {
  render(<SelectAllExample />);

  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "false");
  await expect.element(MainIndicator).not.toBeVisible();

  await userEvent.click(MainTrigger);
  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "true");
  await expect.element(MainIndicator).toBeVisible();

  await verifyAllCheckboxStates(true);
});

// FAILING TEST DUE TO QWIK V2 BUG
// Bug: Interactive element does not update multiple array items; only one item toggles per click
// Reproduction: https://github.com/ToanTrinh01/v2-synchronized-repo
// Issue: https://github.com/QwikDev/qwik/issues/7795
test("clicking main checkbox unchecks all items when all are checked", async () => {
  render(<SelectAllExample />);

  // Setup: check all items first
  await allCheckboxes("click");
  await verifyAllCheckboxStates(true);

  await userEvent.click(MainTrigger);
  await verifyAllCheckboxStates(false);
});

// FAILING TEST DUE TO QWIK V2 BUG
// Bug: Interactive element does not update multiple array items; only one item toggles per click
// Reproduction: https://github.com/ToanTrinh01/v2-synchronized-repo
// Issue: https://github.com/QwikDev/qwik/issues/7795
test("main checkbox toggles with Space key", async () => {
  render(<SelectAllExample />);

  await expect.element(MainTrigger).toBeVisible();
  ((await MainTrigger.element()) as HTMLButtonElement).focus();
  await userEvent.keyboard("{Space}");
  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "true");
  await expect.element(MainIndicator).toBeVisible();

  await userEvent.keyboard("{Space}");
  await expect.element(MainTrigger).toHaveAttribute("aria-checked", "false");
  await expect.element(MainIndicator).not.toBeVisible();
});

// FAILING TEST DUE TO QWIK V2 BUG
// Bug: Interactive element does not update multiple array items; only one item toggles per click
// Reproduction: https://github.com/ToanTrinh01/v2-synchronized-repo
// Issue: https://github.com/QwikDev/qwik/issues/7795
test("Space key on main checkbox toggles all items", async () => {
  render(<SelectAllExample />);

  await expect.element(MainTrigger).toBeVisible();
  ((await MainTrigger.element()) as HTMLButtonElement).focus();
  await userEvent.keyboard("{Space}");
  await verifyAllCheckboxStates(true);

  await userEvent.keyboard("{Space}");
  await verifyAllCheckboxStates(false);
});

test("checklist root has correct role", async () => {
  render(<SelectAllExample />);
  await expect.element(Root).toHaveAttribute("role", "group");
});

test("checklist item has correct checkbox role and state", async () => {
  render(<SelectAllExample />);

  await expect.element(Triggers.nth(0)).toHaveAttribute("role", "checkbox");
  await expect.element(Triggers.nth(0)).toHaveAttribute("aria-checked", "false");
});

test("form integration includes checked items in form data", async () => {
  render(<FormExample />);

  await userEvent.click(Triggers.nth(1)); // Events
  await userEvent.click(Triggers.nth(2)); // Fashion
  await userEvent.click(SubmitButton);

  await expect.element(SubmittedData).toHaveTextContent('{"events":"on","fashion":"on"}');
});
