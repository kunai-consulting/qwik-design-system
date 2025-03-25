import {
  type PropsOf,
  component$,
  useContext,
  useSignal,
  $
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { resizableContextId } from "./resizable-context";

type ResizableHandleProps = PropsOf<"div">;

export const ResizableHandleBase = component$<ResizableHandleProps>((props) => {
  const context = useContext(resizableContextId);
  const elementRef = useSignal<HTMLElement>();

  const onPointerDown$ = $((e: PointerEvent) => {
    if (!elementRef.value) return;
    elementRef.value.setPointerCapture(e.pointerId);

    const isVertical = context.orientation.value === 'vertical';
    const prevPanel = elementRef.value.previousElementSibling as HTMLElement;
    const nextPanel = elementRef.value.nextElementSibling as HTMLElement;

    if (prevPanel && nextPanel) {
      const prevRect = prevPanel.getBoundingClientRect();
      const nextRect = nextPanel.getBoundingClientRect();

      context.startPosition.value = isVertical ? e.clientY : e.clientX;
      context.isDragging.value = true;
      context.initialSizes.value = {
        prev: isVertical ? prevRect.height : prevRect.width,
        next: isVertical ? nextRect.height : nextRect.width
      };
    }
  });

  const onPointerMove$ = $((e: PointerEvent) => {
    if (!context.isDragging.value || context.startPosition.value === null) return;

    const isVertical = context.orientation.value === 'vertical';
    const currentPosition = isVertical ? e.clientY : e.clientX;
    const delta = currentPosition - context.startPosition.value;

    const prevPanel = elementRef.value?.previousElementSibling as HTMLElement;
    const nextPanel = elementRef.value?.nextElementSibling as HTMLElement;

    if (prevPanel && nextPanel && context.initialSizes.value.prev !== undefined) {
      const container = prevPanel.parentElement as HTMLElement;
      const containerSize = isVertical ? container.clientHeight : container.clientWidth;
      const handleSize = elementRef.value?.getBoundingClientRect()[isVertical ? 'height' : 'width'] || 8;

      const prevMinSize = parseInt(prevPanel.dataset.minSize || '0', 10);
      const nextMinSize = parseInt(nextPanel.dataset.minSize || '0', 10);

      const prevSize = context.initialSizes.value.prev;
      const nextSize = context.initialSizes.value.next;

      const newPrevSize = prevSize + delta;
      const newNextSize = nextSize - delta;

      if (
        newPrevSize >= prevMinSize &&
        newNextSize >= nextMinSize &&
        (newPrevSize + newNextSize + handleSize) <= containerSize
      ) {
        const sizeProp = isVertical ? 'height' : 'width';
        prevPanel.style[sizeProp] = `${newPrevSize}px`;
        nextPanel.style[sizeProp] = `${newNextSize}px`;

        context.initialSizes.value = {
          prev: newPrevSize,
          next: newNextSize
        };
        context.startPosition.value = currentPosition;
      }
    }
  });

  const onPointerUp$ = $(() => {
    if (!elementRef.value) return;
    context.isDragging.value = false;
    context.startPosition.value = null;
  });

  return (
    <Render
      fallback="div"
      {...props}
      ref={elementRef}
      data-qds-resizable-handle
      data-orientation={context.orientation.value}
      data-dragging={context.isDragging.value}
      onPointerDown$={onPointerDown$}
      onPointerMove$={onPointerMove$}
      onPointerUp$={onPointerUp$}
    />
  );
});

export const ResizableHandle = withAsChild(ResizableHandleBase);
