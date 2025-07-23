import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";
import { Render, withAsChild } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <TooltipTrigger onClick$={() => alert("Tooltip Trigger")} asChild>
      <div>Tooltip Trigger</div>
    </TooltipTrigger>
  );
});

export const TooltipTriggerBase = component$((props: HTMLElementAttrs<"button">) => {
  return (
    <Render fallback="button" {...props}>
      <Slot />
    </Render>
  );
});

export const TooltipTrigger = withAsChild(TooltipTriggerBase);
