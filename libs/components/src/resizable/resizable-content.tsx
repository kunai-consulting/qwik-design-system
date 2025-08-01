import {
  type PropsOf,
  Slot,
  component$,
  useConstant,
  useContext,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { resizableContextId } from "./resizable-context";

interface PublicResizableContentProps extends Omit<PropsOf<"div">, "onResize$"> {
  // Default height of the content (in pixels)
  height?: number;
  // Default width of the content (in pixels)
  width?: number;
  // Minimum width constraint (in pixels)
  minWidth?: number;
  // Maximum width constraint (in pixels)
  maxWidth?: number;
  // Minimum height constraint (in pixels)
  minHeight?: number;
  // Maximum height constraint (in pixels)
  maxHeight?: number;
  // Whether the content can be collapsed
  collapsible?: boolean;
  // Initial collapsed state
  collapsed?: boolean;
  // Width to collapse to (in pixels)
  collapsedSize?: number;
  collapseThreshold?: number;
  // Callback fired when the content is resized
  onResize$?: (size: number) => void;
  // Callback fired when the content is collapsed
  onCollapse$?: () => void;
  // Callback fired when the content is expanded
  onExpand$?: () => void;
}
/** A resizable content component that can be adjusted using a ResizableHandle */
export const ResizableContent = component$<PublicResizableContentProps>((props) => {
  const context = useContext(resizableContextId);
  const isVertical = context.orientation.value === "vertical";
  const isCollapsed = useSignal(!!props.collapsed);
  const contentId = useId();
  const contentRef = useSignal<HTMLElement>();

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
    ...rest
  } = props;

  const index = useConstant(() => {
    const currIndex = context.currContentIndex;
    context.currContentIndex++;
    return currIndex;
  });

  useTask$(function getIndexOrder() {
    if (index === undefined) {
      throw new Error("ResizableContent cannot find its proper index.");
    }

    context.contents.value[index] = {
      ref: contentRef,
      onResize$: props.onResize$,
      onCollapse$: props.onCollapse$,
      onExpand$: props.onExpand$,
      _index: index
    };
  });

  const getContentStyles = () => {
    const size = isVertical ? height : width;
    const minSize = isVertical ? minHeight : minWidth;
    const maxSize = isVertical ? maxHeight : maxWidth;
    const sizeProp = isVertical ? "height" : "width";
    const minSizeProp = isVertical ? "minHeight" : "minWidth";
    const maxSizeProp = isVertical ? "maxHeight" : "maxWidth";

    const styles: Record<string, string | undefined> = {
      flex: size ? "0 0 auto" : "1"
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
      id={contentId}
      ref={contentRef}
      // The identifier for the resizable content component
      data-qds-resizable-content
      // Indicates the orientation of the resizable content (vertical or horizontal)
      data-orientation={context.orientation.value}
      // Specifies the minimum size constraint for the content
      data-min-size={isVertical ? minHeight : minWidth}
      // Specifies the maximum size constraint for the content
      data-max-size={isVertical ? maxHeight : maxWidth}
      data-collapsible={collapsible}
      data-collapsed-size={collapsedSize}
      data-collapse-threshold={collapseThreshold}
      data-is-collapsed={isCollapsed.value}
      style={getContentStyles()}
    >
      <Slot />
    </Render>
  );
});
