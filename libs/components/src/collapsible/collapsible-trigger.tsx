import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { collapsibleContextId } from "./collapsible-root";

export const CollapsibleTriggerBase = component$<PropsOf<"button">>((props) => {
  const context = useContext(collapsibleContextId);
  const contentId = `${context.itemId}-content`;
  const triggerId = `${context.itemId}-trigger`;

  const handleClick$ = $(async () => {
    if (context.isOpenSig.value && context.collapsible === false) return;
    context.isOpenSig.value = !context.isOpenSig.value;
  });

  if (props.ref) {
    (props.ref as Signal<HTMLButtonElement | undefined>).value = context.triggerRef.value;
  }

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
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </Render>
  );
});

export const CollapsibleTrigger = withAsChild(CollapsibleTriggerBase);
