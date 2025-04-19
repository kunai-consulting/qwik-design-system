import { Slot, component$ } from "@qwik.dev/core";

export default component$(() => {
  return (
    <div>
      <Slot />
    </div>
  );
});
