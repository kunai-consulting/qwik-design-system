import {type PropsOf, Slot, component$, useContext, useTask$, $, useSignal} from "@builder.io/qwik";
import {PaginationContext} from "./pagination-context";

export const PaginationNext = component$(
  ({type, ...props}: PropsOf<"button">) => {
    const context = useContext(PaginationContext);
    const { selectedPage, totalPages, onPageChange$} = context;
    const isDisabled = useSignal(context.selectedPage.value === totalPages);

    useTask$(({ track }) => {
      track(() => context.selectedPage.value);
      isDisabled.value = context.selectedPage.value === totalPages;
    });

    const handleClick = $(() => {
      if (selectedPage.value < totalPages) {
        // onPageChange$(selectedPage.value + 1);
        selectedPage.value++;
      }
    });

    return (
      <button
        data-qds-pagination-next
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
