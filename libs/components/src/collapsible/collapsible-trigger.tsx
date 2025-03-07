import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { collapsibleContextId } from "./collapsible-root";

export const CollapsibleTrigger = component$<PropsOf<"button">>(
  ({ onClick$, ...props }) => {
    const context = useContext(collapsibleContextId);
    const contentId = `${context.itemId}-content`;
    const triggerId = `${context.itemId}-trigger`;

    const handleClick$ = $(async () => {
      if (context.isOpenSig.value && context.collapsible === false) return;
      context.isOpenSig.value = !context.isOpenSig.value;
    });

    return (
      <button
        {...props}
        id={triggerId}
        ref={context.triggerRef}
        disabled={context.disabled}
        data-disabled={context.disabled ? "" : undefined}
        aria-disabled={context.disabled ? "true" : "false"}
        data-open={context.isOpenSig.value ? "" : undefined}
        data-closed={!context.isOpenSig.value ? "" : undefined}
        aria-expanded={context.isOpenSig.value}
        aria-controls={contentId}
        onClick$={[handleClick$, onClick$]}
      >
        <Slot />
      </button>
    );
  }
);
