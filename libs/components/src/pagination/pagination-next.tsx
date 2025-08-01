import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { paginationContextId } from "./pagination-context";

/** Next page navigation button component */
export const PaginationNext = component$(
  ({ type, ...props }: PropsOf<"button"> & { isLast?: boolean }) => {
    const context = useContext(paginationContextId);
    const { selectedPageSig, totalPages } = context;

    const isDisabled = useSignal(selectedPageSig.value === totalPages);

    useTask$(({ track }) => {
      track(() => context.selectedPageSig.value);
      isDisabled.value = context.selectedPageSig.value === totalPages;
    });

    const handleClick = $(() => {
      if (props.isLast) {
        selectedPageSig.value = totalPages;
        return;
      }
      if (selectedPageSig.value < totalPages) {
        if (selectedPageSig.value + 1 <= totalPages) {
          selectedPageSig.value += 1;
        } else {
          selectedPageSig.value = totalPages;
        }
      }
    });

    return (
      <button
        // Identifies the pagination next button element
        data-qds-pagination-next
        type={type ?? "button"}
        {...props}
        disabled={isDisabled.value}
        onClick$={handleClick}
      >
        <Slot />
      </button>
    );
  }
);
