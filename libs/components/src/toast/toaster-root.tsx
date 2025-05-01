import {
  Slot,
  component$,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type ToasterRootProps = {
  defaultDuration?: number;
  pauseOnHover?: boolean;
};

/** Root component that provides context and state management for the toaster */
export const ToasterRootBase = component$((props: ToasterRootProps) => {
  const { defaultDuration = 5000, pauseOnHover = true, ...rest } = props;
  const localId = useId();
  
  const defaultDurationSig = useSignal(defaultDuration);
  const pauseOnHoverSig = useSignal(pauseOnHover);

  useTask$(({ track }) => {
    track(() => defaultDuration);
    defaultDurationSig.value = defaultDuration;
  });

  useTask$(({ track }) => {
    track(() => pauseOnHover);
    pauseOnHoverSig.value = pauseOnHover;
  });


  return (
    <Render 
      {...rest} 
      fallback="div"
      data-qds-toaster-root
      aria-live="polite"
    >
      <Slot />
    </Render>
  );
});

export const ToasterRoot = withAsChild(ToasterRootBase);
