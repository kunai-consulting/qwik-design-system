import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Render, withAsChild } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <TooltipTrigger onClick$={() => alert("Tooltip Trigger")} asChild>
      <div>Tooltip Trigger</div>
    </TooltipTrigger>
  );
});

export const TooltipTriggerBase = component$((props: PropsOf<"button">) => {
  return (
    <Render fallback="button" {...props}>
      <Slot />
    </Render>
  );
});

export const TooltipTrigger = withAsChild(TooltipTriggerBase);
