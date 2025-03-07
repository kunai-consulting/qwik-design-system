import { Slot, component$, useContext, type PropsOf } from "@builder.io/qwik";
import { collapsibleContextId } from "./collapsible-root";

export type CollapsibleContentProps = PropsOf<"div">;

export const CollapsibleContent = component$((props: CollapsibleContentProps) => {
  const context = useContext(collapsibleContextId);
  const contentId = `${context.itemId}-content`;
  const triggerId = `${context.itemId}-trigger`;

  return (
    <div
      {...props}
      ref={context.contentRef}
      id={contentId}
      data-collapsible-content
      data-disabled={context.disabled ? "" : undefined}
      hidden={!context.isOpenSig.value}
      aria-labelledby={triggerId}
    >
      <Slot />
    </div>
  );
});
