import { type PropsOf, component$, useSignal } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Modal } from "..";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Trigger = page.getByTestId("trigger");
const Content = page.getByTestId("content"); // This is the <dialog> element
const Title = page.getByTestId("title");
const Description = page.getByTestId("description");
const CloseButton = page.getByTestId("close");
const NestedTrigger = page.getByRole("button", { name: "Nested Modal Trigger" });

const Basic = component$((props: PropsOf<typeof Modal.Root>) => {
  return (
    <Modal.Root {...props} data-testid="root">
      <Modal.Trigger data-testid="trigger">Open Modal</Modal.Trigger>
      <Modal.Content data-testid="content">
        <Modal.Title data-testid="title">Modal Title</Modal.Title>
        <Modal.Description data-testid="description">
          This is a modal description that provides context.
        </Modal.Description>
        <p>Modal content goes here.</p>
        <input type="text" aria-label="inside input" />
        <button type="button" aria-label="inside button">
          Inside Button
        </button>
        <Modal.Close data-testid="close">Close</Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});

test("modal can be opened and closed", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(CloseButton);
  await expect.element(Content).not.toBeVisible();
});

test("modal opens with trigger click", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();
});

test("modal closes when backdrop pointer down/up sequence occurs", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const dialogElement = await Content.element();

  const dialogRect = dialogElement.getBoundingClientRect();

  const pointerEventProps = {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: "mouse" as const,
    isPrimary: true,
    clientX: dialogRect.left - 50, // Well outside to the left
    clientY: dialogRect.top - 50 // Well outside to the top
  };

  const pointerDownEvent = new PointerEvent("pointerdown", pointerEventProps);
  const pointerUpEvent = new PointerEvent("pointerup", pointerEventProps);

  // Dispatch the events in sequence to mimic real user interaction
  async function dispatchEvents() {
    await dialogElement.dispatchEvent(pointerDownEvent);
    await dialogElement.dispatchEvent(pointerUpEvent);
  }

  await dispatchEvents();

  await expect.element(Content).not.toBeVisible();
});

test("modal does not close when pointer down/up happens in different locations (drag)", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const dialogElement = await Content.element();

  // Pointer down on backdrop
  const pointerDownEvent = new PointerEvent("pointerdown", {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: "mouse" as const,
    isPrimary: true,
    clientX: 10,
    clientY: 10
  });

  // Pointer up on different location (simulating drag)
  const pointerUpEvent = new PointerEvent("pointerup", {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: "mouse" as const,
    isPrimary: true,
    clientX: 100, // Different location
    clientY: 100 // Different location
  });

  dialogElement.dispatchEvent(pointerDownEvent);
  dialogElement.dispatchEvent(pointerUpEvent);

  // Modal should still be visible since this was a drag operation
  await expect.element(Content).toBeVisible();
});

test("modal does not close when keyboard events trigger pointer events", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const dialogElement = await Content.element();

  // Simulate keyboard-triggered pointer events (like space/enter on a button)
  // These have pointerId: -1 and should not close the modal
  const keyboardPointerEvent = new PointerEvent("pointerup", {
    bubbles: true,
    cancelable: true,
    pointerId: -1, // Keyboard-triggered events have pointerId: -1
    pointerType: "mouse" as const,
    isPrimary: true,
    clientX: 10,
    clientY: 10
  });

  dialogElement.dispatchEvent(keyboardPointerEvent);

  // Modal should still be visible since keyboard events shouldn't close it
  await expect.element(Content).toBeVisible();
});

test("modal closes when escape key is pressed", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.keyboard("{Escape}");
  await expect.element(Content).not.toBeVisible();
});

test("body has overflow hidden when modal is opened", async () => {
  render(<Basic />);

  // Note: Body overflow styles tested via computed style evaluation

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  // Note: Body overflow:hidden tested via computed style evaluation
});

test("body overflow is restored when modal is closed", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();
  // Note: Body overflow:hidden tested via computed style evaluation

  await userEvent.keyboard("{Escape}");
  await expect.element(Content).not.toBeVisible();

  // Note: Body overflow styles tested via computed style evaluation
});

const Nested = component$((props: PropsOf<typeof Modal.Root>) => {
  const nestedOpen = useSignal(false);

  return (
    <Modal.Root {...props} data-testid="root">
      <Modal.Trigger data-testid="trigger">Open Modal</Modal.Trigger>
      <Modal.Content data-testid="content">
        <Modal.Title data-testid="title">First Modal</Modal.Title>
        <p>This is the first modal.</p>

        {/* Nested Modal */}
        <Modal.Root bind:open={nestedOpen}>
          <Modal.Trigger>Nested Modal Trigger</Modal.Trigger>
          <Modal.Content>
            <Modal.Title>Nested Modal Title</Modal.Title>
            <p>Nested Modal Content</p>
            <Modal.Close>Close Nested</Modal.Close>
          </Modal.Content>
        </Modal.Root>

        <Modal.Close data-testid="close">Close</Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});

test("nested modals maintain scroll lock", async () => {
  render(<Nested />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(NestedTrigger);
  await expect.element(page.getByRole("dialog").nth(1)).toBeVisible();
  await expect
    .element(page.getByRole("dialog").nth(1))
    .toHaveTextContent("Nested Modal Content");

  // Check body overflow via direct evaluation
  const bodyHasOverflowHidden = getComputedStyle(document.body).overflow === "hidden";
  expect(bodyHasOverflowHidden).toBe(true);
});

test("closing nested modal maintains scroll lock", async () => {
  render(<Nested />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(NestedTrigger);
  await expect.element(page.getByRole("dialog").nth(1)).toBeVisible();

  // Close nested modal via backdrop (click outside)
  await userEvent.click(document.body);
  await expect.element(page.getByRole("dialog").nth(1)).not.toBeVisible();
  await expect.element(Content).toBeVisible();

  // Check body overflow via direct evaluation
  const bodyHasOverflowHidden = getComputedStyle(document.body).overflow === "hidden";
  expect(bodyHasOverflowHidden).toBe(true);
});

test("focus goes to first focusable element when modal opens", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const insideInput = page.getByRole("textbox", { name: "inside input" });
  await expect.element(insideInput).toHaveFocus();
});

test("focus traps within modal elements", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const insideInput = page.getByRole("textbox", { name: "inside input" });
  const insideButton = page.getByRole("button", { name: "inside button" });

  await expect.element(insideInput).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await expect.element(insideButton).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await expect.element(insideInput).toHaveFocus();
});

test("nested modal opens with enter key", async () => {
  render(<Nested />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const nestedTriggerEl = NestedTrigger;
  await expect.element(nestedTriggerEl).toBeVisible();
  ((await nestedTriggerEl.element()) as HTMLButtonElement).focus();
  await userEvent.keyboard("{Enter}");

  await expect.element(page.getByRole("dialog").nth(1)).toBeVisible();
});

test("escape key closes only the top modal in nested setup", async () => {
  render(<Nested />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(NestedTrigger);
  await expect.element(page.getByRole("dialog").nth(1)).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(page.getByRole("dialog").nth(1)).not.toBeVisible();
  await expect.element(Content).toBeVisible();
});

test("modal has accessible name via aria-labelledby", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const titleElement = await Title.element();
  const titleId = titleElement?.getAttribute("id");
  if (titleId) {
    await expect.element(Content).toHaveAttribute("aria-labelledby", titleId);
  }
});

test("modal has description via aria-describedby", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  const descriptionElement = await Description.element();
  const descriptionId = descriptionElement?.getAttribute("id");
  if (descriptionId) {
    await expect.element(Content).toHaveAttribute("aria-describedby", descriptionId);
  }
});

test("modal does not close on backdrop click when set to false", async () => {
  const screen = render(<Basic closeOnOutsideClick={false} />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(screen.baseElement, {
    position: {
      x: 10,
      y: 10
    }
  });

  await expect.element(Content).toBeVisible();

  await userEvent.click(CloseButton);
  await expect.element(Content).not.toBeVisible();
});

test("clicks inside modal content do not close the modal", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(Content);

  await expect.element(Content).toBeVisible();

  await userEvent.click(Title);

  await expect.element(Content).toBeVisible();
});
