import { Slot, component$, type PropsOf } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export interface ToastItemCloseProps extends PropsOf<"button"> {
  /** For aria-label
   * @default "Close"
   */
  altText?: string;
  // onClick$ provided by Toaster/Item context?
  // onClick$?: QRL<() => void>;
}

// Base implementation
const ToastItemCloseBase = component$<ToastItemCloseProps>((props) => {
  const { altText = "Close", ...rest } = props;
  return (
    <Render
      fallback="button"
      type="button"
      aria-label={altText}
      data-toast-close
      {...rest} // Pass class etc.
    >
      <Slot />
    </Render>
  );
});

// Export wrapped version
export const ToastItemClose = withAsChild(ToastItemCloseBase);
