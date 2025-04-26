import {
  component$,
  type JSXOutput,
  type PropsOf,
  Slot,
  useComputed$,
  useContext
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toggleContextId } from "./toggle-root";

type ToggleIndicatorProps = PropsOf<"span"> & {
  fallback?: JSXOutput;
};

export const ToggleIndicatorBase = component$((props: ToggleIndicatorProps) => {
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
    >
      {isFallbackSig.value ? fallback : <Slot />}
    </Render>
  );
});

export const ToggleIndicator = withAsChild(ToggleIndicatorBase);
