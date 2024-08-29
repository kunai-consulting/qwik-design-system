import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const PaginationEllipsis = component$((props: PropsOf<"div">) => {
  return (
    <div data-qds-pagination-ellipsis {...props}>
      <Slot />
    </div>
  );
});
