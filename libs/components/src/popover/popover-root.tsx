import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal
} from "@qwik.dev/core";

export const HPopoverRoot = component$(() => {
  return (
    <div>
      <Slot />
    </div>
  );
});
