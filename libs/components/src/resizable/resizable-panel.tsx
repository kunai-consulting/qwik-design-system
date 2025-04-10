import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useContext,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { getNextIndex } from "../../utils/indexer";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { resizableContextId } from "./resizable-context";

interface PublicResizablePanelProps extends Omit<PropsOf<"div">, "onResize$"> {
  // Default height of the panel (in pixels)
  height?: number;
  // Default width of the panel (in pixels)
  width?: number;
  // Minimum width constraint (in pixels)
  minWidth?: number;
  // Maximum width constraint (in pixels)
  maxWidth?: number;
  // Minimum height constraint (in pixels)
  minHeight?: number;
  // Maximum height constraint (in pixels)
  maxHeight?: number;
  // Whether the panel can be collapsed
  collapsible?: boolean;
  // Initial collapsed state
  collapsed?: boolean;
  // Width to collapse to (in pixels)
  collapsedSize?: number;
  collapseThreshold?: number;
  // Callback fired when the panel is resized
  onResize$?: QRL<(size: number) => void>;
  // Callback fired when the panel is collapsed
  onCollapse$?: QRL<() => void>;
  // Callback fired when the panel is expanded
  onExpand$?: QRL<() => void>;
  _index?: number;
}
/** A resizable panel component that can be adjusted using a ResizableHandle */
export const ResizablePanelBase = component$<PublicResizablePanelProps>((props) => {
  const context = useContext(resizableContextId);
  const isVertical = context.orientation.value === "vertical";
  const isCollapsed = useSignal(!!props.collapsed);
  const panelId = useId();
  const panelRef = useSignal<HTMLElement>();

  const {
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    collapsible = false,
    collapsedSize = 0,
    collapseThreshold = 0.05,
    onResize$,
    _index,
    ...rest
  } = props;

  useTask$(function getIndexOrder() {
    if (_index === undefined) {
      throw new Error("ResizablePanel cannot find its proper index.");
    }

    context.panels.value[_index] = {
      ref: panelRef,
      onResize$: props.onResize$,
      onCollapse$: props.onCollapse$,
      onExpand$: props.onExpand$,
      _index: _index
    };
  });

  const getPanelStyles = () => {
    const size = isVertical ? height : width;
    const minSize = isVertical ? minHeight : minWidth;
    const maxSize = isVertical ? maxHeight : maxWidth;
    const sizeProp = isVertical ? "height" : "width";
    const minSizeProp = isVertical ? "minHeight" : "minWidth";
    const maxSizeProp = isVertical ? "maxHeight" : "maxWidth";

    const savedSize =
      _index !== undefined ? context.initialSizes.value[_index] : undefined;

    const styles: Record<string, string | undefined> = {
      flex: size || savedSize ? "0 0 auto" : "1"
    };

    if (savedSize) {
      styles[sizeProp] = `${savedSize}px`;
    } else if (size) {
      styles[sizeProp] = `${size}px`;
    }

    if (minSize) {
      styles[minSizeProp] = `${minSize}px`;
    }
    if (maxSize) {
      styles[maxSizeProp] = `${maxSize}px`;
    }
    return styles;
  };

  return (
    <Render
      fallback="div"
      {...rest}
      id={panelId}
      ref={panelRef}
      // The identifier for the resizable panel component
      data-qds-resizable-panel
      // Indicates the orientation of the resizable panel (vertical or horizontal)
      data-orientation={context.orientation.value}
      // Specifies the minimum size constraint for the panel
      data-min-size={isVertical ? minHeight : minWidth}
      // Specifies the maximum size constraint for the panel
      data-max-size={isVertical ? maxHeight : maxWidth}
      data-collapsible={collapsible ? "true" : "false"}
      data-collapsed-size={collapsedSize}
      data-collapse-threshold={collapseThreshold}
      data-is-collapsed={isCollapsed.value.toString()}
      style={getPanelStyles()}
    >
      <Slot />
    </Render>
  );
});

export const ResizablePanel = withAsChild(ResizablePanelBase, (props) => {
  const nextIndex = getNextIndex("resizable");
  props._index = nextIndex;
  return props;
});
