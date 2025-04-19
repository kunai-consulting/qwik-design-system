import { type PropsOf, Slot, component$, useStyles$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import styles from "./resizable.css?inline";
type ResizableRootProps = {
  orientation: "horizontal" | "vertical";
} & PropsOf<"div">;

export const ResizableRootBase = component$<ResizableRootProps>(
  ({ orientation, onChange$ }) => {
    useStyles$(styles);
    return (
      <Render fallback="div" data-qds-resizable-root>
        <Slot />
      </Render>
    );
  }
);

export const ResizableRoot = withAsChild(ResizableRootBase);
