import { type PropsOf, Slot, component$, useContext, $, useTask$, useSignal } from "@builder.io/qwik";
import { paginationContext } from "./pagination-context";

export const PaginationFirst = component$(
  ({type, ...props}: PropsOf<"button">) => {
    const context = useContext(paginationContext);
    const { selectedPage, onPageChange$ } = context;
    const isDisabled = useSignal(context.selectedPage.value === 1);

    useTask$(({ track }) => {
      track(() => context.selectedPage.value);
      isDisabled.value = context.selectedPage.value === 1;
    });

    const handleClick = $(() => {
      selectedPage.value = 1;
      onPageChange$(selectedPage.value);
    });

    return (
      <button
        data-qds-pagination-first
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
