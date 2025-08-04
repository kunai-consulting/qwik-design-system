import { component$ } from "@qwik.dev/core";
import { expect, test } from "vitest";
import { render } from "vitest-browser-qwik";
import { Checkbox } from "..";

const Basic = component$(() => {
  return (
    <Checkbox.Root>
      <Checkbox.Trigger>
        <Checkbox.Indicator>Checked</Checkbox.Indicator>
      </Checkbox.Trigger>
    </Checkbox.Root>
  );
});

test("checkbox role visible", async () => {
  const screen = render(<Basic />);

  await expect.element(screen.getByRole("checkbox")).toBeVisible();
});
