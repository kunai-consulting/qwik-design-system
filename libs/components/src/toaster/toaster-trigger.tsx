import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toasterContextId } from "./toaster-context";

type ToasterTriggerProps = PropsOf<"button">;

export const ToasterTriggerBase = component$((props: ToasterTriggerProps) => {
  const context = useContext(toasterContextId);

  const handleClick$ = $((event: MouseEvent) => {
    // Default toast creation - consumers can override this by providing their own onClick$
    context.createToast({
      open: true,
      title: "Notification",
      description: "This is a toast notification",
      duration: context.duration
    });
  });

  return (
    <Render
      {...props}
      fallback="button"
      data-qds-toaster-trigger
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </Render>
  );
});

export const ToasterTrigger = withAsChild(ToasterTriggerBase);
