import { $, type PropsOf, component$, useSignal, useStore } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Pagination } from "..";

const Root = page.getByTestId("root");
const NextButtons = page.getByTestId("next");
const PrevButtons = page.getByTestId("previous");
const Items = page.getByTestId("item");
const Ellipsis = page.getByTestId("ellipsis");

const Basic = component$((props: PropsOf<typeof Pagination.Root>) => {
  const totalPages = props.totalPages || 10;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination.Root {...props} data-testid="root" totalPages={totalPages} pages={pages}>
      <Pagination.Previous data-testid="previous">Previous</Pagination.Previous>

      {pages.map((page) => (
        <Pagination.Item key={page} data-testid="item">
          {page}
        </Pagination.Item>
      ))}

      <Pagination.Ellipsis data-testid="ellipsis">...</Pagination.Ellipsis>
      <Pagination.Next data-testid="next">Next</Pagination.Next>
    </Pagination.Root>
  );
});

const WithFirstLast = component$((props: PropsOf<typeof Pagination.Root>) => {
  const totalPages = props.totalPages || 12;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination.Root {...props} data-testid="root" totalPages={totalPages} pages={pages}>
      <Pagination.Previous isFirst data-testid="previous">
        First
      </Pagination.Previous>
      <Pagination.Previous data-testid="previous">Previous</Pagination.Previous>

      {pages.map((page) => (
        <Pagination.Item key={page} data-testid="item">
          {page}
        </Pagination.Item>
      ))}

      <Pagination.Ellipsis data-testid="ellipsis">...</Pagination.Ellipsis>
      <Pagination.Next data-testid="next">Next</Pagination.Next>
      <Pagination.Next isLast data-testid="next">
        Last
      </Pagination.Next>
    </Pagination.Root>
  );
});

test("pagination controls should be visible", async () => {
  render(<Basic />);

  await expect.element(Root).toBeVisible();
  await expect.element(NextButtons.nth(0)).toBeVisible();
  await expect.element(PrevButtons.nth(0)).toBeVisible();
  await expect.element(Items.nth(0)).toBeVisible();
  await expect.element(Ellipsis).toBeVisible();
});

test("first page should be current initially", async () => {
  render(<Basic />);

  await expect.element(Items.nth(0)).toHaveAttribute("data-current");
  await expect.element(Items.nth(0)).toHaveAttribute("aria-current", "page");
});

test("clicking page button changes current page", async () => {
  render(<Basic />);

  await userEvent.click(Items.nth(1));
  await expect.element(Items.nth(1)).toHaveAttribute("data-current");
  await expect.element(Items.nth(0)).not.toHaveAttribute("data-current");
});

test("next button navigates to next page", async () => {
  render(<Basic />);

  await userEvent.click(NextButtons.nth(0));

  await expect.element(Items.nth(1)).toHaveAttribute("data-current");
});

test("previous button navigates to previous page", async () => {
  render(<Basic currentPage={3} />);

  await userEvent.click(PrevButtons.nth(0));

  await expect.element(Items.nth(1)).toHaveAttribute("data-current");
});

test("last button navigates to last page", async () => {
  render(<WithFirstLast />);

  await userEvent.click(NextButtons.nth(1));

  await expect.element(Items.last()).toHaveAttribute("data-current");
});

test("first button navigates to first page", async () => {
  render(<WithFirstLast currentPage={5} />);

  await userEvent.click(PrevButtons.nth(0));

  await expect.element(Items.first()).toHaveAttribute("data-current");
});

test("component with initial page", async () => {
  render(<Basic currentPage={5} />);

  await expect
    .element(page.getByTestId("item").filter({ hasText: "5" }))
    .toHaveAttribute("data-current");
});

test("disabled pagination prevents interaction", async () => {
  render(<Basic disabled />);

  await expect.element(Root).toHaveAttribute("data-disabled");
  await expect.element(Root).toHaveAttribute("aria-disabled", "true");
});

test("currently active page has aria-current attribute", async () => {
  render(<Basic />);

  await expect.element(Items.nth(0)).toHaveAttribute("aria-current", "page");
});

const ExternalState = component$(() => {
  const selectedSignal = useSignal(1);
  const selectedStore = useStore({ page: 1 });
  const totalPages = 10;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <Pagination.Root
        data-testid="root"
        totalPages={totalPages}
        pages={pages}
        bind:page={selectedSignal}
        currentPage={selectedStore.page}
        onPageChange$={$((newPage) => {
          selectedStore.page = newPage;
        })}
      >
        <Pagination.Previous data-testid="previous">Previous</Pagination.Previous>

        {pages.map((page) => (
          <Pagination.Item key={page} data-testid="item">
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Ellipsis data-testid="ellipsis">...</Pagination.Ellipsis>
        <Pagination.Next data-testid="next">Next</Pagination.Next>
      </Pagination.Root>

      <button
        type="button"
        data-testid="change-value"
        onClick$={$(() => (selectedStore.page = 5))}
      >
        Change to page 5
      </button>

      <button
        type="button"
        data-testid="change-signal"
        onClick$={$(() => (selectedSignal.value = 7))}
      >
        Change to page 7
      </button>
    </div>
  );
});

test("external value changes update pagination", async () => {
  render(<ExternalState />);

  await expect.element(Items.nth(0)).toHaveAttribute("data-current");

  await userEvent.click(page.getByTestId("change-value"));

  await expect
    .element(page.getByTestId("item").getByText("5"))
    .toHaveAttribute("data-current");
});

test("external signal changes update pagination", async () => {
  render(<ExternalState />);

  await expect.element(Items.nth(0)).toHaveAttribute("data-current");

  await userEvent.click(page.getByTestId("change-signal"));

  await expect
    .element(page.getByTestId("item").filter({ hasText: "7" }))
    .toHaveAttribute("data-current");
});
