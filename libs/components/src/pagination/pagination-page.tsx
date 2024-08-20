import { Slot, component$ } from "@builder.io/qwik";

export const PaginationPage = component$(() => {
  return (
    <div>
      <Slot />
    </div>
  );
});
