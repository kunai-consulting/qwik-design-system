import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export type ToasterItemCloseProps = PropsOf<"button">;

export const ToasterItemCloseBase = component$((props: ToasterItemCloseProps) => {
  const { ...rest } = props;
  const context = useContext(toastContextId);

  const handleClick$ = $(() => {
    context.hide$();
  });

  return (
    <Render
      {...rest}
      fallback="button"
      type="button"
      aria-label="Close"
      data-qds-toaster-item-close
      onClick$={[handleClick$, props.onClick$]}
    >
      {props.children ? <Slot /> : "✕"}
    </Render>
  );
});

export const ToasterItemClose = withAsChild(ToasterItemCloseBase);
