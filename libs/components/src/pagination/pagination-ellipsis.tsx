import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";

/** Renders an ellipsis item in the pagination */
export const PaginationEllipsis = component$((props: HTMLElementAttrs<"div">) => {
  return (
    // Identifies the pagination ellipsis element
    <div data-qds-pagination-ellipsis {...props}>
      <Slot />
    </div>
  );
});
