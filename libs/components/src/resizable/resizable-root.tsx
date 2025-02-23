import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

type ResizableRootProps = {
  orientation: "horizontal" | "vertical";
} & PropsOf<"div">;

export const ResizableRootBase = component$<ResizableRootProps>(
  ({ orientation, onChange$ }) => {
    return (
      <Render fallback="div">
        <Slot />
      </Render>
    );
  }
);

export const ResizableRoot = withAsChild(ResizableRootBase);
