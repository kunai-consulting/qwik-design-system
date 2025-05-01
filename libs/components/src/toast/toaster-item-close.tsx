import {
  $,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export interface ToasterItemCloseProps extends PropsOf<"button"> {
  label?: string;
}

export const ToasterItemCloseBase = component$((props: ToasterItemCloseProps) => {
  const { label = "Close", ...rest } = props;
  const context = useContext(toastContextId);
  
  const ariaLabel = useComputed$(() => {
    return props["aria-label"] || label;
  });

  const handleClick$ = $(() => {
    context.hide$();
  });

  return (
    <Render
      {...rest}
      fallback="button"
      type="button"
      aria-label={ariaLabel.value}
      data-qds-toaster-item-close
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </Render>
  );
});

export const ToasterItemClose = withAsChild(ToasterItemCloseBase); 