import { Slot, component$, type PropsOf } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export type ToastItemProgressTrackProps = PropsOf<"div">;

const ToastItemProgressTrackBase = component$<ToastItemProgressTrackProps>((props) => {
  return (
    <Render
      fallback="div"
      role="presentation"
      data-toast-progress-track
      // class={['toast-progress-track', props.class]} // Class merging handled by withAsChild
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const ToastItemProgressTrack = withAsChild(ToastItemProgressTrackBase);
