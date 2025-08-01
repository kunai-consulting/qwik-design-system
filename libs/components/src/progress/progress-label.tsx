import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { ProgressContext } from "./progress-context";

type ProgressLabelElement = PropsOf<"span">;
export const ProgressLabel = component$<ProgressLabelElement>((props) => {
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
