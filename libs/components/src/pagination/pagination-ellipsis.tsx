import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

/** Renders an ellipsis item in the pagination */
export const PaginationEllipsis = component$((props: PropsOf<"div">) => {
  return (
    // Identifies the pagination ellipsis element
    <div data-qds-pagination-ellipsis {...props}>
      <Slot />
    </div>
  );
});
