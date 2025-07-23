import { $, type HTMLElementAttrs, Slot, component$, useSignal } from "@qwik.dev/core";
import { Render } from "@kunai-consulting/qwik";

export default component$(() => {
  const tooltipRef = useSignal<HTMLButtonElement>();

  return (
    <TooltipTrigger
      ref={tooltipRef}
      onClick$={() => console.log("The consumer's ref", tooltipRef.value)}
    >
      Tooltip Trigger
    </TooltipTrigger>
  );
});

export const TooltipTrigger = component$((props: HTMLElementAttrs<"button">) => {
  const triggerRef = useSignal<HTMLElement | undefined>();

  const handleAlert$ = $(() => {
    alert("Tooltip Trigger");
    console.log("The library author's ref", triggerRef.value);
  });

  return (
    <Render
      fallback="button"
      internalRef={triggerRef}
      {...props}
      onClick$={[handleAlert$, props.onClick$]}
    >
      <Slot />
    </Render>
  );
});
