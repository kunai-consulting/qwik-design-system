import { component$, type PropsOf } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export type ToastItemProgressFillProps = PropsOf<"div"> & {
  // Add any specific props needed later, e.g., related to animation state
};

const ToastItemProgressFillBase = component$<ToastItemProgressFillProps>((props) => {
  // TODO: Implement animation based on duration/state from context?
  return (
    <Render
      fallback="div"
      role="presentation"
      data-toast-progress-fill
      {...props} // Pass class etc.
      // Style would control width/animation
    />
    // Note: No Slot needed here as it's a self-contained visual element
  );
});

export const ToastItemProgressFill = withAsChild(ToastItemProgressFillBase);
