import type { AsChildTypes } from "@kunai-consulting/core";
import { Render } from "@kunai-consulting/qwik";
import { type PropsOf, Slot, component$ } from "@qwik.dev/core";

export default component$(() => {
  return (
    <TooltipTrigger onClick$={() => alert("Tooltip Trigger")} asChild>
      <div>Tooltip Trigger</div>
    </TooltipTrigger>
  );
});

export const TooltipTrigger = component$((props: PropsOf<"button"> & AsChildTypes) => {
  return (
    <Render fallback="button" {...props}>
      <Slot />
    </Render>
  );
});
