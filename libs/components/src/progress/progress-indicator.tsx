import { type HTMLElementAttrs, component$, useComputed$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { ProgressContext } from "./progress-context";

type ProgressIndicatorElement = HTMLElementAttrs<"div">;
export const ProgressIndicatorBase = component$<ProgressIndicatorElement>((props) => {
  const { ...indicatorProps } = props;

  const context = useContext(ProgressContext);

  const translateXSig = useComputed$(() => {
    if (context.valueSig.value === null) return "translateX(0%)";
    const range = context.maxSig.value - context.minSig.value;
    const progress = (context.valueSig.value - context.minSig.value) / range;
    const remainingPercentage = 100 - progress * 100;
    return `translateX(-${remainingPercentage}%)`;
  });

  return (
    <Render
      fallback="div"
      data-qds-progress-indicator
      style={{ transform: translateXSig.value }}
      title="progress_indicator"
      {...context.dataAttributesSig.value}
      {...indicatorProps}
    />
  );
});

export const ProgressIndicator = withAsChild(ProgressIndicatorBase);
