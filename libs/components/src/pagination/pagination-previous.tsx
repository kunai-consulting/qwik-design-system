import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const PaginationPrevious = component$(
  ({ type, ...props }: PropsOf<"button">) => {
    return (
      <button data-qds-pagination-previous type={type ?? "button"} {...props}>
        <Slot />
      </button>
    );
  }
);
