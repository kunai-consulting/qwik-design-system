import { component$ } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Label } from ".";

// Top-level locator constants using data-testid
const LabelEl = page.getByTestId("label");
const InputEl = page.getByTestId("input");

const Basic = component$(() => {
  const inputId = "name-input";
  return (
    <div>
      <Label data-testid="label" for={inputId}>
        Name
      </Label>
      <input id={inputId} data-testid="input" />
    </div>
  );
});

test("label is visible", async () => {
  render(<Basic />);

  await expect.element(LabelEl).toBeVisible();
});

test("clicking label focuses the input", async () => {
  render(<Basic />);

  await userEvent.click(LabelEl);
  await expect.element(InputEl).toHaveFocus();
});

test("double clicking label does not select text", async () => {
  render(<Basic />);

  await userEvent.dblClick(LabelEl);
  const selection = window.getSelection()?.toString();
  expect(selection).toBeFalsy();
});
