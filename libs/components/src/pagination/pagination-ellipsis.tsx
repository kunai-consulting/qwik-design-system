import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const PaginationEllipsis = component$((props: PropsOf<"div">) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
