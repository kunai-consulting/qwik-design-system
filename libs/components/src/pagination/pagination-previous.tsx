import { type PropsOf, Slot, component$, useContext, $, useTask$, useSignal } from "@builder.io/qwik";
import { paginationContextId } from "./pagination-context.ts";

export const PaginationPrevious = component$(
  ({type, ...props}: PropsOf<"button"> & { isFirst?: boolean }) => {
    const context = useContext(paginationContextId);
    const { selectedPageSig } = context;
    const isDisabled = useSignal(context.selectedPageSig.value === 1);

    useTask$(({ track }) => {
      track(() => context.selectedPageSig.value);
      isDisabled.value = context.selectedPageSig.value === 1;
    });

    const handleClick = $(() => {
      if (props.isFirst) {
        selectedPageSig.value = 1;
        return;
      }
      if (selectedPageSig.value > 1) {
        if (selectedPageSig.value - 1 >= 1) {
          selectedPageSig.value = selectedPageSig.value - 1;
        } else {
          selectedPageSig.value = 1;
        }
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
