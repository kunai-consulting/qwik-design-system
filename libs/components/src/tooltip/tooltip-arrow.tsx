import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tooltipContextId } from "./tooltip-root";

type TooltipArrowProps = PropsOf<"div"> & {
  side?: string;
};

const TooltipArrowBase = component$<TooltipArrowProps>((props) => {
  const context = useContext(tooltipContextId);

  const { side, ...rest } = props;

  const currentSide = side || context?.side || "bottom";

  return (
    <Render data-tooltip-arrow data-side={currentSide} fallback="div" {...rest}>
      <Slot />
    </Render>
  );
});

export const TooltipArrow = withAsChild(TooltipArrowBase);
