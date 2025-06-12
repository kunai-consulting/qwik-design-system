import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { ProgressContext } from "./progress-context";

type ProgressLabelElement = PropsOf<"span">;
export const ProgressLabelBase = component$<ProgressLabelElement>((props) => {
  const { ...labelProps } = props;

  const context = useContext(ProgressContext);

  return (
    <Render
      fallback="span"
      data-qds-progress-label
      {...context.dataAttributesSig.value}
      {...labelProps}
    >
      <Slot />
    </Render>
  );
});

export const ProgressLabel = withAsChild(ProgressLabelBase);
