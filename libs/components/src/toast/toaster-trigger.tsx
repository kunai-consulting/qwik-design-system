import {
  $,
  type PropFunction,
  type PropsOf,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type ToastType, toastContextId } from "./toast-context";

export interface ToasterTriggerProps extends PropsOf<"button"> {
  toastType?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  onClick$?: PropFunction<() => void>;
}

/** Component that triggers a toast when clicked */
export const ToasterTriggerBase = component$((props: ToasterTriggerProps) => {
  const { toastType, title, description, duration, onClick$, ...rest } = props;
  const context = useContext(toastContextId);

  const handleClick$ = $(() => {
    context.show$({
      type: toastType,
      title,
      description,
      duration: duration || context.defaultDuration.value,
      dismissible: true
    });
  });

  return (
    <Render
      {...rest}
      fallback="button"
      data-qds-toaster-trigger
      onClick$={[handleClick$, onClick$]}
    >
      <Slot />
    </Render>
  );
});

export const ToasterTrigger = withAsChild(ToasterTriggerBase);
