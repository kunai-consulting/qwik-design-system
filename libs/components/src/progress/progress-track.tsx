import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { ProgressContext } from "./progress-context";

type ProgressTrackElement = HTMLElementAttrs<"div">;
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
