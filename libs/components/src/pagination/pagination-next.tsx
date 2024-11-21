import { type PropsOf, Slot, component$, useContext, useTask$, $, useSignal } from "@builder.io/qwik";
import { paginationContext } from "./pagination-context";

export const PaginationNext = component$(
  ({type, ...props}: PropsOf<"button"> & { isLast?: boolean }) => {
    const context = useContext(paginationContext);
    const { selectedPageSig, totalPages, perPageSig } = context;

    const isDisabled = useSignal(selectedPageSig.value === totalPages);

    useTask$(({track}) => {
      track(() => context.selectedPageSig.value);
      isDisabled.value = context.selectedPageSig.value === totalPages;
    });

    const handleClick = $(() => {
      if (props.isLast) {
        selectedPageSig.value = totalPages;
        return;
      }
      if (selectedPageSig.value < totalPages) {
        if (selectedPageSig.value + perPageSig.value <= totalPages) {
          selectedPageSig.value = selectedPageSig.value + perPageSig.value;
        } else {
          selectedPageSig.value = totalPages;
        }
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
