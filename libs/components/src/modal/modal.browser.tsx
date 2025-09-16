import { type PropsOf, component$, useSignal } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Modal } from "..";
import { pointer } from "../../vitest/pointer";

pointer.showDebugDots = true;

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Trigger = page.getByTestId("trigger");
const Content = page.getByTestId("content"); // This is the <dialog> element
const Title = page.getByTestId("title");
const Description = page.getByTestId("description");
const CloseButton = page.getByTestId("close");
const ParentTrigger = page.getByTestId("parent-trigger");
const ParentContent = page.getByTestId("parent-content");
const NestedTrigger = page.getByTestId("child-trigger");
const NestedContent = page.getByTestId("child-content");

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

test("modal closes when backdrop is pressed outside", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await expect.element(Trigger).toBeVisible();

  await pointer.tapOutside(Content, { side: "top", distance: 50 });

  await expect.element(Content).not.toBeVisible();
});

test("modal does not close when drag happens in different locations", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await pointer.drag(
    Content,
    { client: { x: 10, y: 10 } },
    { client: { x: 100, y: 100 } }
  );

  await expect.element(Content).toBeVisible();
});

test("modal does not close when keyboard-triggered pointer events occur", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  // pointer event from keyboard
  await pointer.up(Content, { client: { x: 10, y: 10 } }, { pointerId: -1 });

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

  await expect.element(document.body).not.toHaveStyle({ overflow: "hidden" });

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await expect.element(document.body).toHaveStyle({ overflow: "hidden" });
});

test("body overflow is restored when modal is closed", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await expect.element(document.body).toHaveStyle({ overflow: "hidden" });

  await userEvent.keyboard("{Escape}");
  await expect.element(Content).not.toBeVisible();

  await expect.element(document.body).not.toHaveStyle({ overflow: "hidden" });
});

const Nested = component$((props: PropsOf<typeof Modal.Root>) => {
  const nestedOpen = useSignal(false);

  return (
    <Modal.Root {...props} data-testid="parent-root">
      <Modal.Trigger data-testid="parent-trigger">Open Modal</Modal.Trigger>
      <Modal.Content data-testid="parent-content">
        <Modal.Title data-testid="parent-title">First Modal</Modal.Title>
        <p>This is the first modal.</p>

        {/* Nested Modal */}
        <Modal.Root bind:open={nestedOpen}>
          <Modal.Trigger data-testid="child-trigger">Nested Modal Trigger</Modal.Trigger>
          <Modal.Content data-testid="child-content">
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

  await userEvent.click(ParentTrigger);
  await expect.element(ParentContent).toBeVisible();

  await userEvent.click(NestedTrigger);
  await expect.element(NestedContent).toBeVisible();
  await expect.element(NestedContent).toHaveTextContent("Nested Modal Content");

  // Check body overflow via direct evaluation
  const bodyHasOverflowHidden = getComputedStyle(document.body).overflow === "hidden";
  expect(bodyHasOverflowHidden).toBe(true);
});

test("closing nested modal maintains scroll lock", async () => {
  render(<Nested />);

  await userEvent.click(ParentTrigger);
  await expect.element(ParentContent).toBeVisible();

  await userEvent.click(NestedTrigger);
  await expect.element(NestedContent).toBeVisible();

  await pointer.tapOutside(NestedContent, { side: "bottom", distance: 50 });

  await expect.element(NestedContent).not.toBeVisible();

  await expect.element(ParentContent).toBeVisible();

  await expect.element(document.body).toHaveStyle({ overflow: "hidden" });
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
  await expect.element(CloseButton).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await expect.element(Trigger).not.toHaveFocus();
});

test("nested modal opens with enter key", async () => {
  render(<Nested />);

  await userEvent.click(ParentTrigger);
  await expect.element(ParentContent).toBeVisible();

  await expect(NestedTrigger).toBeVisible();
  ((await NestedTrigger.element()) as HTMLButtonElement).focus();
  await userEvent.keyboard("{Enter}");

  await expect.element(NestedContent).toBeVisible();
});

test("escape key closes only the top modal in nested setup", async () => {
  render(<Nested />);

  await userEvent.click(ParentTrigger);
  await expect.element(ParentContent).toBeVisible();

  await userEvent.click(NestedTrigger);
  await expect.element(NestedContent).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(NestedContent).not.toBeVisible();
  await expect.element(ParentContent).toBeVisible();
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
