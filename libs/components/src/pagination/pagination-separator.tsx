import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Render } from "../render/render";

/** Renders an ellipsis item in the pagination */
export const PaginationSeparator = component$((props: PropsOf<"div">) => {
  return (
    <Render
      {...props}
      fallback="div"
      aria-label={props["aria-label"] ?? "Pages skipped"}
      // Identifies the pagination ellipsis element
      data-qds-pagination-separator
    >
      <Slot />
    </Render>
  );
});
