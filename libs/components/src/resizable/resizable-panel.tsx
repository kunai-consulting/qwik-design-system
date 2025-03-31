import { type PropsOf, Slot, component$, useContext, useId } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { resizableContextId } from "./resizable-context";
interface PublicResizablePanelProps extends PropsOf<"div"> {
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
  defaultCollapsed?: boolean;
  // Width to collapse to (in pixels)
  collapsedSize?: number;
}
/** A resizable panel component that can be adjusted using a ResizableHandle */
export const ResizablePanelBase = component$<PublicResizablePanelProps>((props) => {
  const context = useContext(resizableContextId);
  const isVertical = context.orientation.value === "vertical";
  const panelId = useId(); // Добавляем уникальный id
  const { width, height, minWidth, minHeight, maxWidth, maxHeight, ...rest } = props;
  const getPanelStyles = () => {
    const size = isVertical ? height : width;
    const minSize = isVertical ? minHeight : minWidth;
    const maxSize = isVertical ? maxHeight : maxWidth;
    const sizeProp = isVertical ? "height" : "width";
    const minSizeProp = isVertical ? "minHeight" : "minWidth";
    const maxSizeProp = isVertical ? "maxHeight" : "maxWidth";
    const styles: Record<string, string | undefined> = {
      flex: size ? "0 0 auto" : "1",
      position: "relative",
      display: "flex"
    };
    if (size) {
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
      // The identifier for the resizable panel component
      data-qds-resizable-panel
      // Indicates the orientation of the resizable panel (vertical or horizontal)
      data-orientation={context.orientation.value}
      // Specifies the minimum size constraint for the panel
      data-min-size={isVertical ? minHeight : minWidth}
      // Specifies the maximum size constraint for the panel
      data-max-size={isVertical ? maxHeight : maxWidth}
      style={getPanelStyles()}
    >
      <Slot />
    </Render>
  );
});
export const ResizablePanel = withAsChild(ResizablePanelBase);
