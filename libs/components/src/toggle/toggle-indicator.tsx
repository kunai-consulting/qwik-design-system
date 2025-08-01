import {
  type JSXOutput,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { toggleContextId } from "./toggle-root";

type ToggleIndicatorProps = PropsOf<"span"> & {
  fallback?: JSXOutput;
};

export const ToggleIndicator = component$((props: ToggleIndicatorProps) => {
  const { fallback, ...rest } = props;

  const context = useContext(toggleContextId);

  const isFallbackSig = useComputed$(
    () => props.fallback && context.isPressedSig.value === false
  );

  return (
    <Render
      {...rest}
      fallback="span"
      data-disabled={context.isDisabledSig.value}
      data-pressed={context.isPressedSig.value}
      data-qds-toggle-indicator
    >
      {isFallbackSig.value ? fallback : <Slot />}
    </Render>
  );
});
