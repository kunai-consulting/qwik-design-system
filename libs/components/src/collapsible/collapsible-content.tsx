import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { collapsibleContextId } from "./collapsible-root";

export type CollapsibleContentProps = PropsOf<"div">;

export const CollapsibleContent = component$((props: CollapsibleContentProps) => {
  const context = useContext(collapsibleContextId);
  const contentId = `${context.itemId}-content`;
  const triggerId = `${context.itemId}-trigger`;

  return (
    <Render
      {...props}
      fallback="div"
      internalRef={context.contentRef}
      id={contentId}
      data-qds-collapsible-content
      data-disabled={context.disabled ? "" : undefined}
      data-open={context.isOpenSig.value}
      data-closed={!context.isOpenSig.value}
      aria-labelledby={triggerId}
      inert={!context.isOpenSig.value}
    >
      <Slot />
    </Render>
  );
});
