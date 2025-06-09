import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tooltipContextId } from "./tooltip-root";

type TooltipArrowProps = PropsOf<"div"> & {
  height?: number;
  width?: number;
};

const TooltipArrowBase = component$<TooltipArrowProps>((props) => {
  const context = useContext(tooltipContextId);
  const { height = 12, width = 12, style, ...rest } = props;

  const currentSide = context?.side || "top";
  const currentAlign = context?.align || "center";

  const mergedStyle = Object.assign(
    {},
    {
      "--qds-tooltip-arrow-width": `${width}px`,
      "--qds-tooltip-arrow-height": `${height}px`
    },
    style
  );

  return (
    <Render
      data-qds-tooltip-arrow
      data-side={currentSide}
      data-align={currentAlign}
      fallback="div"
      style={mergedStyle}
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const TooltipArrow = withAsChild(TooltipArrowBase);
