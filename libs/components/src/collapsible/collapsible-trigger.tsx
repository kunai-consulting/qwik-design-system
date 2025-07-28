import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { collapsibleContextId } from "./collapsible-root";

// changing collapsible trigger

export const CollapsibleTriggerBase = component$<PropsOf<"button">>(
  ({ onClick$, ...props }) => {
    const context = useContext(collapsibleContextId);
    const contentId = `${context.itemId}-content`;
    const triggerId = `${context.itemId}-trigger`;

    const handleClick$ = $((e: MouseEvent) => {
      e.stopPropagation();
      context.isOpenSig.value = !context.isOpenSig.value;
    });

    return (
      <Render
        {...props}
        fallback="button"
        id={triggerId}
        internalRef={context.triggerRef}
        disabled={context.disabled}
        data-disabled={context.disabled ? "" : undefined}
        aria-disabled={context.disabled ? "true" : "false"}
        data-open={context.isOpenSig.value}
        data-closed={!context.isOpenSig.value}
        aria-expanded={context.isOpenSig.value}
        aria-controls={contentId}
        onClick$={[handleClick$, onClick$]}
      >
        <Slot />
      </Render>
    );
  }
);

export const CollapsibleTrigger = withAsChild(CollapsibleTriggerBase);
