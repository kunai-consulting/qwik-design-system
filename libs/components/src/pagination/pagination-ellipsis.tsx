import { Slot, component$ } from "@builder.io/qwik";

export const PaginationEllipsis = component$(() => {
  return (
    <div>
      <Slot />
    </div>
  );
});
