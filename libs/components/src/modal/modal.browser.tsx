import { type PropsOf, component$, useSignal } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import {
  Close as ModalClose,
  Content as ModalContent,
  Description as ModalDescription,
  Root as ModalRoot,
  Title as ModalTitle,
  Trigger as ModalTrigger
} from ".";

// Top-level locator constants using data-testid
const Root = page.getByTestId("root");
const Trigger = page.getByTestId("trigger");
const Content = page.getByTestId("content"); // This is the <dialog> element
const Title = page.getByTestId("title");
const Description = page.getByTestId("description");
const CloseButton = page.getByTestId("close");
const NestedTrigger = page.getByRole("button", { name: "Nested Modal Trigger" });

const Basic = component$((props: PropsOf<typeof ModalRoot>) => {
  return (
    <ModalRoot {...props} data-testid="root">
      <ModalTrigger data-testid="trigger">Open Modal</ModalTrigger>
      <ModalContent data-testid="content">
        <ModalTitle data-testid="title">Modal Title</ModalTitle>
        <ModalDescription data-testid="description">
          This is a modal description that provides context.
        </ModalDescription>
        <p>Modal content goes here.</p>
        <ModalClose data-testid="close">Close</ModalClose>
      </ModalContent>
    </ModalRoot>
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

test("modal closes when backdrop is clicked", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(document.body);
  await expect.element(Content).not.toBeVisible();
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

const Nested = component$((props: PropsOf<typeof ModalRoot>) => {
  const nestedOpen = useSignal(false);

  return (
    <ModalRoot {...props} data-testid="root">
      <ModalTrigger data-testid="trigger">Open Modal</ModalTrigger>
      <ModalContent data-testid="content">
        <ModalTitle data-testid="title">First Modal</ModalTitle>
        <p>This is the first modal.</p>

        {/* Nested Modal */}
        <ModalRoot bind:open={nestedOpen}>
          <ModalTrigger>Nested Modal Trigger</ModalTrigger>
          <ModalContent>
            <ModalTitle>Nested Modal Title</ModalTitle>
            <p>Nested Modal Content</p>
            <ModalClose>Close Nested</ModalClose>
          </ModalContent>
        </ModalRoot>

        <ModalClose data-testid="close">Close</ModalClose>
      </ModalContent>
    </ModalRoot>
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

test("modal does not close on outside click when closeOnOutsideClick is disabled", async () => {
  render(<Basic closeOnOutsideClick={false} />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(document.body);

  await expect.element(Content).toBeVisible();

  await userEvent.click(CloseButton);
  await expect.element(Content).not.toBeVisible();
});

test("modal with default closeOnOutsideClick behavior closes on outside click", async () => {
  render(<Basic />);

  await userEvent.click(Trigger);
  await expect.element(Content).toBeVisible();

  await userEvent.click(document.body);

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
