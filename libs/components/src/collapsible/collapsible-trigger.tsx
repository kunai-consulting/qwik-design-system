import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { collapsibleContextId } from "./collapsible-root";

export const CollapsibleTriggerBase = component$<PropsOf<"button">>(
  ({ onClick$, ...props }) => {
    const context = useContext(collapsibleContextId);
    const contentId = `${context.itemId}-content`;
    const triggerId = `${context.itemId}-trigger`;

    const handleClick$ = $(async () => {
      if (context.isOpenSig.value && context.collapsible === false) return;
      context.isOpenSig.value = !context.isOpenSig.value;
    });

    return (
      <Render
        {...props}
        fallback="button"
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
      </Render>
    );
  }
);

export const CollapsibleTrigger = withAsChild(CollapsibleTriggerBase);
