import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const PaginationPage = component$((props: PropsOf<"div">) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
