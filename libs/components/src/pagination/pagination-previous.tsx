import { type PropsOf, Slot, component$, useContext, $, useTask$, useSignal } from "@builder.io/qwik";
import { paginationContext } from "./pagination-context";

export const PaginationPrevious = component$(
  ({type, ...props}: PropsOf<"button">) => {
    const context = useContext(paginationContext);
    const { selectedPage, perPage, onPageChange$ } = context;
    const isDisabled = useSignal(context.selectedPage.value === 1);

    useTask$(({ track }) => {
      track(() => context.selectedPage.value);
      isDisabled.value = context.selectedPage.value === 1;
    });

    const handleClick = $(() => {
      if (selectedPage.value > 1) {
        if (selectedPage.value - perPage >= 1) {
          selectedPage.value = selectedPage.value - perPage;
        } else {
          selectedPage.value = 1;
        }
        onPageChange$(selectedPage.value);
      }
    });

    return (
      <button
        data-qds-pagination-previous
        type={type ?? "button"}
        {...props}
        disabled={isDisabled.value}
        onClick$={handleClick}
      >
        <Slot/>
      </button>
    );
  }
);
