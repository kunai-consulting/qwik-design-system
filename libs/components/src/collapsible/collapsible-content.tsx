import { Slot, component$, useContext, type PropsOf } from "@builder.io/qwik";
import { collapsibleContextId } from "./collapsible-root";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export type CollapsibleContentProps = PropsOf<"div">;

export const CollapsibleContentBase = component$((props: CollapsibleContentProps) => {
  const context = useContext(collapsibleContextId);
  const contentId = `${context.itemId}-content`;
  const triggerId = `${context.itemId}-trigger`;

  return (
    <Render
      {...props}
      fallback="div"
      ref={context.contentRef}
      id={contentId}
      data-collapsible-content
      data-disabled={context.disabled ? "" : undefined}
      hidden={!context.isOpenSig.value}
      aria-labelledby={triggerId}
    >
      <Slot />
    </Render>
  );
});

export const CollapsibleContent = withAsChild(CollapsibleContentBase);
