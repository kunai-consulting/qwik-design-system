import { component$, useSignal } from "@qwik.dev/core";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";

const InteractiveCounter = component$<{ initialCount: number }>(
  ({ initialCount = 0 }) => {
    const count = useSignal(initialCount);

    return (
      <>
        <div>Count is {count.value}</div>
        <button type="button" onClick$={() => count.value++}>
          Increment
        </button>
      </>
    );
  }
);

test("renders local counter", async () => {
  const screen = render(<InteractiveCounter initialCount={1} />);

  await expect.element(screen.getByText("Count is 1")).toBeVisible();
  await screen.getByRole("button", { name: "Increment" }).click();
  await expect.element(screen.getByText("Count is 2")).toBeVisible();
});
