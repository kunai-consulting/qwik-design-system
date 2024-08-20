import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const PaginationNext = component$(
  ({ type, ...props }: PropsOf<"button">) => {
    return (
      <button type={type ?? "button"} {...props}>
        <Slot />
      </button>
    );
  }
);
