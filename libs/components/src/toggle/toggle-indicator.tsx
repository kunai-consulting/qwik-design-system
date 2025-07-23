import {
  type JSXOutput,
  type HTMLElementAttrs,
  Slot,
  component$,
  useComputed$,
  useContext
} from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toggleContextId } from "./toggle-root";

type ToggleIndicatorProps = HTMLElementAttrs<"span"> & {
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
      data-qds-toggle-indicator
    >
      {isFallbackSig.value ? fallback : <Slot />}
    </Render>
  );
});

export const ToggleIndicator = withAsChild(ToggleIndicatorBase);
