import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export type ToasterTriggerProps = PropsOf<"button"> & {
  title?: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
};

/** Component that triggers a toast when clicked */
export const ToasterTriggerBase = component$((props: ToasterTriggerProps) => {
  const { title, description, duration, dismissible = true, ...rest } = props;

  const context = useContext(toastContextId);

  const handleClick$ = $(() => {
    context.show$({
      title,
      description,
      duration: duration !== undefined ? duration : context.duration.value,
      dismissible
    });
  });

  return (
    <Render
      {...rest}
      fallback="button"
      data-qds-toaster-trigger
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </Render>
  );
});

export const ToasterTrigger = withAsChild(ToasterTriggerBase);
