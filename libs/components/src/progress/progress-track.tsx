import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { ProgressContext } from "./progress-context";

type ProgressTrackElement = PropsOf<"div">;
export const ProgressTrackBase = component$<ProgressTrackElement>((props) => {
  const { ...trackProps } = props;

  const context = useContext(ProgressContext);

  return (
    <Render
      fallback="div"
      data-qds-progress-track
      {...context.dataAttributesSig.value}
      {...trackProps}
    >
      <Slot />
    </Render>
  );
});

export const ProgressTrack = withAsChild(ProgressTrackBase);
