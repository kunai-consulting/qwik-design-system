import { type PropsOf, Slot, component$, useContext, useTask$, $, useSignal } from "@builder.io/qwik";
import { paginationContext } from "./pagination-context";

export const PaginationLast = component$(
  ({type, ...props}: PropsOf<"button">) => {
    const context = useContext(paginationContext);
    const { selectedPage, totalPages, onPageChange$ } = context;
    const isDisabled = useSignal(context.selectedPage.value === totalPages);

    useTask$(({track}) => {
      track(() => context.selectedPage.value);
      isDisabled.value = context.selectedPage.value === totalPages;
    });

    const handleClick = $(() => {
      selectedPage.value = totalPages;
      onPageChange$(selectedPage.value);
    });

    return (
      <button
        data-qds-pagination-last
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
