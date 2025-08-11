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

/** Previous page navigation button component */
export const PaginationPrevious = component$(
  ({ type, ...props }: PropsOf<"button"> & { isFirst?: boolean }) => {
    const context = useContext(paginationContextId);
    const { selectedPage } = context;
    const isDisabled = useSignal(context.selectedPage.value === 1);

    useTask$(({ track }) => {
      track(context.selectedPage);
      isDisabled.value = context.selectedPage.value === 1;
    });

    const handleClick = $(() => {
      if (props.isFirst) {
        selectedPage.value = 1;
        return;
      }
      if (selectedPage.value > 1) {
        if (selectedPage.value - 1 >= 1) {
          selectedPage.value -= 1;
        } else {
          selectedPage.value = 1;
        }
      }
    });

    return (
      <button
        // Identifies the pagination previous button element
        data-qds-pagination-previous
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
