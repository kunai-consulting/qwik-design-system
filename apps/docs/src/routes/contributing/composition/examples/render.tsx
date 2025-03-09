import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Render } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <TooltipTrigger onClick$={() => alert("Tooltip Trigger")}>
      Tooltip Trigger
    </TooltipTrigger>
  );
});

export const TooltipTrigger = component$((props: PropsOf<"button">) => {
  return (
    <Render fallback="button" {...props}>
      <Slot />
    </Render>
  );
});
