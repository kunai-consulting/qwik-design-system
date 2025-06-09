import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { tooltipContextId } from "./tooltip-root";

type TooltipContentProps = PropsOf<"div"> & {
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
};

const TooltipContentBase = component$<TooltipContentProps>((props) => {
  const context = useContext(tooltipContextId);
  const {
    side = "top",
    align = "center",
    sideOffset = 0,
    alignOffset = 0,
    style,
    ...rest
  } = props;

  // Set side and align in context for headless children
  context.side = side;
  context.align = align;

  const mergedStyle = Object.assign(
    {},
    {
      "--qds-tooltip-side-offset": `${sideOffset}px`,
      "--qds-tooltip-align-offset": `${alignOffset}px`
    },
    style
  );

  return (
    <PopoverContentBase
      ref={context.contentRef}
      role="tooltip"
      data-qds-tooltip-content
      data-side={side}
      data-align={align}
      style={mergedStyle}
      {...rest}
    >
      <Slot />
    </PopoverContentBase>
  );
});

export const TooltipContent = withAsChild(TooltipContentBase);
