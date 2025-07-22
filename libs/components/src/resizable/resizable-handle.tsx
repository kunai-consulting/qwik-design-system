import {
  $,
  type PropsOf,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
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

type PublicContents = {
  prevContent: HTMLElement;
  nextContent: HTMLElement;
  container: HTMLElement;
};

type PublicContentSizes = {
  handleSize: number;
  containerSize: number;
  prevSize: number;
  nextSize: number;
  prevMinSize: number;
  nextMinSize: number;
  availableSize: number;
};

/** A resizable handle component that allows users to drag and resize adjacent contents */
export const ResizableHandleBase = component$<PublicResizableHandleProps>((props) => {
  const context = useContext(resizableContextId);
  const handleRef = useSignal<HTMLElement>();
  const prevContentId = useSignal<string>();
  const nextContentId = useSignal<string>();
  const totalDragDistance = useSignal(0);
  const currentValue = useSignal<{
    min: number;
    max: number;
    current: number;
  } | null>(null);

  const getMinSize = $((element: HTMLElement) => {
    return Number.parseInt(element.dataset.minSize || "0", 10);
  });

  const getContents = $(() => {
    if (!handleRef.value) return null;
    const prevContent = handleRef.value.previousElementSibling as HTMLElement;
    const nextContent = handleRef.value.nextElementSibling as HTMLElement;
    const container = prevContent?.parentElement as HTMLElement;
    if (!(prevContent && nextContent && container)) return null;
    return { prevContent, nextContent, container } as PublicContents;
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

  const getContentSizes = $(
    async (contents: PublicContents, sizeProps: PublicSizeProperties) => {
      const { sizeProp, clientSizeProp } = sizeProps;
      const { prevContent, nextContent, container } = contents;
      const [prevMinSize, nextMinSize] = await Promise.all([
        getMinSize(prevContent),
        getMinSize(nextContent)
      ]);
      const handleSize = handleRef.value?.getBoundingClientRect()[sizeProp] || 0;
      const containerSize = container[clientSizeProp];
      const prevSize = prevContent.getBoundingClientRect()[sizeProp];
      const nextSize = nextContent.getBoundingClientRect()[sizeProp];
      return {
        handleSize,
        containerSize,
        prevSize,
        nextSize,
        prevMinSize,
        nextMinSize,
        availableSize: containerSize - handleSize
      } as PublicContentSizes;
    }
  );

  const calculateValue = $(async () => {
    const contents = await getContents();
    if (!contents) return null;
    const sizeProps = await getSizeProperties();
    const sizes = await getContentSizes(contents, sizeProps);
    return {
      min: Math.round((sizes.prevMinSize / sizes.availableSize) * 100),
      max: Math.round(
        ((sizes.availableSize - sizes.nextMinSize) / sizes.availableSize) * 100
      ),
      current: Math.round((sizes.prevSize / sizes.availableSize) * 100)
    };
  });

  const performResize = $(async (delta: number) => {
    const contents = await getContents();
    if (!contents) return false;
    const sizeProps = await getSizeProperties();
    const sizes = await getContentSizes(contents, sizeProps);

    const isPrevCollapsible = contents.prevContent.dataset.collapsible === "";

    const newPrevSize = sizes.prevSize + delta;
    const newNextSize = sizes.nextSize - delta;

    if (isPrevCollapsible) {
      const prevCollapsedSize = Number(contents.prevContent.dataset.collapsedSize);
      const prevCollapseThreshold = Number(
        contents.prevContent.dataset.collapseThreshold
      );
      const isCollapsed = contents.prevContent.dataset.isCollapsed === "true";

      if (!isCollapsed && newPrevSize <= sizes.prevMinSize) {
        totalDragDistance.value += delta;
      } else if (isCollapsed && delta > 0) {
        totalDragDistance.value += delta;
      }

      if (
        !isCollapsed &&
        newPrevSize <= sizes.prevMinSize &&
        Math.abs(totalDragDistance.value) > sizes.prevMinSize * prevCollapseThreshold
      ) {
        contents.prevContent.dataset.isCollapsed = "true";
        contents.prevContent.style[sizeProps.minSizeProp] = `${prevCollapsedSize}px`;
        contents.prevContent.style[sizeProps.sizeProp] = `${prevCollapsedSize}px`;
        contents.nextContent.style[sizeProps.sizeProp] =
          `${sizes.containerSize - prevCollapsedSize - sizes.handleSize}px`;
        totalDragDistance.value = 0;

        // Trigger onCollapse callback
        const prevIndex = context.contents.value.findIndex(
          (p) => p.ref.value === contents.prevContent
        );
        if (prevIndex !== -1) {
          const prevContent = context.contents.value[prevIndex];
          prevContent.onCollapse$?.();
        }

        context.startPosition.value = null;
        return true;
      }

      if (isCollapsed) {
        if (
          delta > 0 &&
          totalDragDistance.value > prevCollapsedSize * prevCollapseThreshold
        ) {
          contents.prevContent.dataset.isCollapsed = "false";
          contents.prevContent.style[sizeProps.minSizeProp] = `${sizes.prevMinSize}px`;
          contents.prevContent.style[sizeProps.sizeProp] = `${sizes.prevMinSize}px`;
          contents.nextContent.style[sizeProps.sizeProp] =
            `${sizes.containerSize - sizes.prevMinSize - sizes.handleSize}px`;

          // Trigger onExpand callback
          const prevIndex = context.contents.value.findIndex(
            (p) => p.ref.value === contents.prevContent
          );
          if (prevIndex !== -1) {
            const prevContent = context.contents.value[prevIndex];
            prevContent.onExpand$?.();
          }

          totalDragDistance.value = 0;
          return true;
        }
        return false;
      }
    }

    const currentContentsSize = sizes.prevSize + sizes.nextSize;

    const isValidResize =
      newPrevSize >= sizes.prevMinSize &&
      newNextSize >= sizes.nextMinSize &&
      newPrevSize + newNextSize <= currentContentsSize;

    if (isValidResize) {
      if (isPrevCollapsible && Math.abs(totalDragDistance.value) > 0) {
        return false;
      }
      contents.prevContent.style[sizeProps.sizeProp] = `${newPrevSize}px`;
      contents.nextContent.style[sizeProps.sizeProp] = `${newNextSize}px`;
      return true;
    }
    return false;
  });

  useTask$(async () => {
    if (!handleRef.value) return;

    const prevContent = handleRef.value.previousElementSibling as HTMLElement;
    const nextContent = handleRef.value.nextElementSibling as HTMLElement;

    if (!(prevContent && nextContent)) return;

    prevContentId.value = prevContent.id;
    nextContentId.value = nextContent.id;
  });

  useTask$(async ({ track }) => {
    const isDragging = track(() => context.isDragging.value);
    if (isDragging && handleRef.value) {
      currentValue.value = await calculateValue();
    }
  });

  const onPointerDown$ = $(async (e: PointerEvent) => {
    if (!handleRef.value || context.disabled.value) return;
    handleRef.value.setPointerCapture(e.pointerId);
    totalDragDistance.value = 0;
    const contents = await getContents();
    if (!contents) return;
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

  const handleResize = $(async () => {
    const contents = await getContents();
    if (!contents) return;
    const sizeProps = await getSizeProperties();
    const prevSize = contents.prevContent.getBoundingClientRect()[sizeProps.sizeProp];
    const nextSize = contents.nextContent.getBoundingClientRect()[sizeProps.sizeProp];

    const prevIndex = context.contents.value.findIndex(
      (p) => p.ref.value === contents.prevContent
    );
    const nextIndex = context.contents.value.findIndex(
      (p) => p.ref.value === contents.nextContent
    );

    if (prevIndex !== -1) {
      const prevContent = context.contents.value[prevIndex];
      prevContent.onResize$?.(prevSize);
    }
    if (nextIndex !== -1) {
      const nextContent = context.contents.value[nextIndex];
      nextContent.onResize$?.(nextSize);
    }
  });

  const onPointerUp$ = $(async () => {
    if (!handleRef.value) return;
    context.isDragging.value = false;
    context.startPosition.value = null;
    await handleResize();
  });

  const onKeyDown$ = $(async (e: KeyboardEvent) => {
    if (!handleRef.value || context.disabled.value) return;
    const isVertical = context.orientation.value === "vertical";
    const contents = await getContents();
    if (!contents) return;
    const sizeProps = await getSizeProperties();
    const sizes = await getContentSizes(contents, sizeProps);
    const baseStep = sizes.availableSize * 0.01; // 1%
    const step = e.shiftKey ? baseStep * 10 : baseStep; // 10% with Shift
    if (e.key === "Home" || e.key === "End") {
      const targetPrevSize =
        e.key === "Home"
          ? sizes.prevMinSize
          : sizes.containerSize - sizes.handleSize - sizes.nextMinSize;
      await performResize(targetPrevSize - sizes.prevSize);
      await handleResize();
    } else {
      const deltaMap = {
        ArrowLeft: !isVertical ? -step : 0,
        ArrowRight: !isVertical ? step : 0,
        ArrowUp: isVertical ? -step : 0,
        ArrowDown: isVertical ? step : 0
      };
      const delta = deltaMap[e.key as keyof typeof deltaMap] || 0;
      if (delta) {
        await performResize(delta);
        await handleResize();
      }
    }
  });

  return (
    <Render
      fallback="div"
      {...props}
      ref={handleRef}
      // The identifier for the resizable handle component
      data-qds-resizable-handle
      // Indicates the orientation of the resizable handle (vertical or horizontal)
      data-orientation={context.orientation.value}
      // Indicates whether the handle is currently being dragged
      data-dragging={context.isDragging.value}
      // Indicates whether the resizable handle is disabled
      data-disabled={context.disabled.value}
      onPointerDown$={[onPointerDown$, props.onPointerDown$]}
      onPointerMove$={[onPointerMove$, props.onPointerMove$]}
      onPointerUp$={[onPointerUp$, props.onPointerUp$]}
      onKeyDown$={[onKeyDown$, props.onKeyDown$]}
      role="separator"
      aria-orientation={context.orientation.value}
      aria-valuemin={currentValue.value?.min ?? 0}
      aria-valuemax={currentValue.value?.max ?? 100}
      aria-valuenow={currentValue.value?.current}
      aria-controls={`${prevContentId.value} ${nextContentId.value}`}
      aria-disabled={context.disabled.value}
      tabIndex={0}
    />
  );
});
export const ResizableHandle = withAsChild(ResizableHandleBase);
