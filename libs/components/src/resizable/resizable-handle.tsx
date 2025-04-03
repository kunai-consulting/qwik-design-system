import {
  $,
  type PropsOf,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { resizableContextId } from "./resizable-context";
type PublicResizableHandleProps = PropsOf<"div">;
type PublicSizeProperties = {
  sizeProp: "width" | "height";
  clientSizeProp: "clientWidth" | "clientHeight";
  minSizeProp: "minWidth" | "minHeight";
  maxSizeProp: "maxWidth" | "maxHeight";
  clientAxis: "clientX" | "clientY";
};
type PublicPanels = {
  prevPanel: HTMLElement;
  nextPanel: HTMLElement;
  container: HTMLElement;
};
type PublicPanelSizes = {
  handleSize: number;
  containerSize: number;
  prevSize: number;
  nextSize: number;
  prevMinSize: number;
  nextMinSize: number;
  availableSize: number;
};
/** A resizable handle component that allows users to drag and resize adjacent panels */
export const ResizableHandleBase = component$<PublicResizableHandleProps>((props) => {
  const context = useContext(resizableContextId);
  const elementRef = useSignal<HTMLElement>();
  const prevPanelId = useSignal<string>();
  const nextPanelId = useSignal<string>();
  const totalDragDistance = useSignal(0);
  const currentValue = useSignal<{
    min: number;
    max: number;
    current: number;
  } | null>(null);
  const getMinSize = $((element: HTMLElement) => {
    return Number.parseInt(element.dataset.minSize || "0", 10);
  });
  const getPanels = $(() => {
    if (!elementRef.value) return null;
    const prevPanel = elementRef.value.previousElementSibling as HTMLElement;
    const nextPanel = elementRef.value.nextElementSibling as HTMLElement;
    const container = prevPanel?.parentElement as HTMLElement;
    if (!(prevPanel && nextPanel && container)) return null;
    return { prevPanel, nextPanel, container } as PublicPanels;
  });
  const getSizeProperties = $(() => {
    const isVertical = context.orientation.value === "vertical";
    return {
      sizeProp: isVertical ? "height" : "width",
      clientSizeProp: isVertical ? "clientHeight" : "clientWidth",
      minSizeProp: isVertical ? "minHeight" : "minWidth",
      maxSizeProp: isVertical ? "maxHeight" : "maxWidth",
      clientAxis: isVertical ? "clientY" : "clientX"
    } as PublicSizeProperties;
  });
  const getPanelSizes = $(
    async (panels: PublicPanels, sizeProps: PublicSizeProperties) => {
      const { sizeProp, clientSizeProp } = sizeProps;
      const { prevPanel, nextPanel, container } = panels;
      const [prevMinSize, nextMinSize] = await Promise.all([
        getMinSize(prevPanel),
        getMinSize(nextPanel)
      ]);
      const handleSize = elementRef.value?.getBoundingClientRect()[sizeProp] || 0;
      const containerSize = container[clientSizeProp];
      const prevSize = prevPanel.getBoundingClientRect()[sizeProp];
      const nextSize = nextPanel.getBoundingClientRect()[sizeProp];
      return {
        handleSize,
        containerSize,
        prevSize,
        nextSize,
        prevMinSize,
        nextMinSize,
        availableSize: containerSize - handleSize
      } as PublicPanelSizes;
    }
  );
  const calculateValue = $(async () => {
    const panels = await getPanels();
    if (!panels) return null;
    const sizeProps = await getSizeProperties();
    const sizes = await getPanelSizes(panels, sizeProps);
    return {
      min: Math.round((sizes.prevMinSize / sizes.availableSize) * 100),
      max: Math.round(
        ((sizes.availableSize - sizes.nextMinSize) / sizes.availableSize) * 100
      ),
      current: Math.round((sizes.prevSize / sizes.availableSize) * 100)
    };
  });
  const performResize = $(async (delta: number) => {
    const panels = await getPanels();
    if (!panels) return false;
    const sizeProps = await getSizeProperties();
    const sizes = await getPanelSizes(panels, sizeProps);

    const isPrevCollapsible = panels.prevPanel.dataset.collapsible === 'true';

    let newPrevSize = sizes.prevSize + delta;
    let newNextSize = sizes.nextSize - delta;

    if (isPrevCollapsible) {
      const prevCollapsedSize = Number(panels.prevPanel.dataset.collapsedSize);
      const prevCollapseThreshold = Number(panels.prevPanel.dataset.collapseThreshold);
      const isCollapsed = panels.prevPanel.dataset.isCollapsed === 'true';

      if (!isCollapsed && newPrevSize <= sizes.prevMinSize) {
        totalDragDistance.value += delta;
      } else if (isCollapsed && delta > 0) {
        totalDragDistance.value += delta;
      }

      if (!isCollapsed &&
        newPrevSize <= sizes.prevMinSize &&
        Math.abs(totalDragDistance.value) > (sizes.prevMinSize * prevCollapseThreshold)) {
        panels.prevPanel.dataset.isCollapsed = 'true';
        panels.prevPanel.style[sizeProps.minSizeProp] = `${prevCollapsedSize}px`;
        panels.prevPanel.style[sizeProps.sizeProp] = `${prevCollapsedSize}px`;
        panels.nextPanel.style[sizeProps.sizeProp] =
          `${sizes.containerSize - prevCollapsedSize - sizes.handleSize}px`;
        totalDragDistance.value = 0;

        context.startPosition.value = null;
        return true;
      }

      if (isCollapsed) {
        if (delta > 0 && totalDragDistance.value > (prevCollapsedSize * prevCollapseThreshold)) {
          panels.prevPanel.dataset.isCollapsed = 'false';
          panels.prevPanel.style[sizeProps.minSizeProp] = `${sizes.prevMinSize}px`;
          panels.prevPanel.style[sizeProps.sizeProp] = `${sizes.prevMinSize}px`;
          panels.nextPanel.style[sizeProps.sizeProp] =
            `${sizes.containerSize - sizes.prevMinSize - sizes.handleSize}px`;
          totalDragDistance.value = 0;
          return true;
        }
        return false;
      }
    }

    const currentPanelsSize = sizes.prevSize + sizes.nextSize;

    const isValidResize =
      newPrevSize >= sizes.prevMinSize &&
      newNextSize >= sizes.nextMinSize &&
      newPrevSize + newNextSize <= currentPanelsSize;

    if (isValidResize) {
      if (isPrevCollapsible && Math.abs(totalDragDistance.value) > 0) {
        return false;
      }
      panels.prevPanel.style[sizeProps.sizeProp] = `${newPrevSize}px`;
      panels.nextPanel.style[sizeProps.sizeProp] = `${newNextSize}px`;
      return true;
    }
    return false;
  });
  useTask$(async ({ track }) => {
    track(() => elementRef.value);
    if (!elementRef.value) return;
    const panels = await getPanels();
    if (!panels) return;
    prevPanelId.value = panels.prevPanel.id;
    nextPanelId.value = panels.nextPanel.id;
    currentValue.value = await calculateValue();
  });
  useTask$(async ({ track }) => {
    const isDragging = track(() => context.isDragging.value);
    if (isDragging && elementRef.value) {
      currentValue.value = await calculateValue();
    }
  });
  const onPointerDown$ = $(async (e: PointerEvent) => {
    if (!elementRef.value || context.disabled.value) return;
    elementRef.value.setPointerCapture(e.pointerId);
    totalDragDistance.value = 0;
    const panels = await getPanels();
    if (!panels) return;
    const sizeProps = await getSizeProperties();
    context.startPosition.value = e[sizeProps.clientAxis];
    context.isDragging.value = true;
  });
  const onPointerMove$ = $(async (e: PointerEvent) => {
    if (
      !context.isDragging.value ||
      context.startPosition.value === null ||
      context.disabled.value
    )
      return;
    const { clientAxis } = await getSizeProperties();
    const currentPosition = e[clientAxis];
    const delta = currentPosition - context.startPosition.value;
    if (await performResize(delta)) {
      context.startPosition.value = currentPosition;
    }
  });
  const onPointerUp$ = $(() => {
    if (!elementRef.value) return;
    context.isDragging.value = false;
    context.startPosition.value = null;
  });
  const onKeyDown$ = $(async (e: KeyboardEvent) => {
    if (!elementRef.value || context.disabled.value) return;
    const isVertical = context.orientation.value === "vertical";
    const panels = await getPanels();
    if (!panels) return;
    const sizeProps = await getSizeProperties();
    const sizes = await getPanelSizes(panels, sizeProps);
    const baseStep = sizes.availableSize * 0.01; // 1%
    const step = e.shiftKey ? baseStep * 10 : baseStep; // 10% with Shift
    if (e.key === "Home" || e.key === "End") {
      const targetPrevSize =
        e.key === "Home"
          ? sizes.prevMinSize
          : sizes.containerSize - sizes.handleSize - sizes.nextMinSize;
      await performResize(targetPrevSize - sizes.prevSize);
    } else {
      const deltaMap = {
        ArrowLeft: !isVertical ? -step : 0,
        ArrowRight: !isVertical ? step : 0,
        ArrowUp: isVertical ? -step : 0,
        ArrowDown: isVertical ? step : 0
      };
      const delta = deltaMap[e.key as keyof typeof deltaMap] || 0;
      if (delta) await performResize(delta);
    }
  });
  return (
    <Render
      fallback="div"
      {...props}
      ref={elementRef}
      // The identifier for the resizable handle component
      data-qds-resizable-handle
      // Indicates the orientation of the resizable handle (vertical or horizontal)
      data-orientation={context.orientation.value}
      // Indicates whether the handle is currently being dragged
      data-dragging={context.isDragging.value}
      // Indicates whether the resizable handle is disabled
      data-disabled={context.disabled.value}
      onPointerDown$={onPointerDown$}
      onPointerMove$={onPointerMove$}
      onPointerUp$={onPointerUp$}
      onKeyDown$={onKeyDown$}
      role="separator"
      aria-orientation={context.orientation.value}
      aria-valuemin={currentValue.value?.min ?? 0}
      aria-valuemax={currentValue.value?.max ?? 100}
      aria-valuenow={currentValue.value?.current}
      aria-controls={`${prevPanelId.value} ${nextPanelId.value}`}
      aria-disabled={context.disabled.value}
      tabIndex={0}
    />
  );
});
export const ResizableHandle = withAsChild(ResizableHandleBase);
