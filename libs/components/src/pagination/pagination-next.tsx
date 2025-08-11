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
    const { selectedPage, totalPages } = context;

    const isDisabled = useSignal(selectedPage.value === totalPages);

    useTask$(({ track }) => {
      track(context.selectedPage);
      isDisabled.value = context.selectedPage.value === totalPages;
    });

    const handleClick = $(() => {
      if (props.isLast) {
        selectedPage.value = totalPages;
        return;
      }
      if (selectedPage.value < totalPages) {
        if (selectedPage.value + 1 <= totalPages) {
          selectedPage.value += 1;
        } else {
          selectedPage.value = totalPages;
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
