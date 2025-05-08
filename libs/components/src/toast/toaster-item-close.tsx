import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export type ToasterItemCloseProps = {
  label?: string;
} & PropsOf<"button">;

/** Close button for toast items */
export const ToasterItemCloseBase = component$((props: ToasterItemCloseProps) => {
  const { label = "Close", ...rest } = props;
  const context = useContext(toastContextId);

  const handleClick$ = $(() => {
    context.hide$();
  });

  return (
    <Render
      {...rest}
      fallback="button"
      data-qds-toaster-item-close
      onClick$={[handleClick$, props.onClick$]}
      aria-label={rest["aria-label"] || label}
    >
      <Slot />
    </Render>
  );
});

export const ToasterItemClose = withAsChild(ToasterItemCloseBase);
