import { type Signal, createContextId } from "@qwik.dev/core";

export interface ContentRef {
  ref: Signal<HTMLElement | undefined>;
  onResize$?: (size: number) => void;
  onCollapse$?: () => void;
  onExpand$?: () => void;
  _index: number;
}

export interface ResizableContext {
  orientation: Signal<"horizontal" | "vertical">;
  disabled: Signal<boolean>;
  startPosition: Signal<number | null>;
  isDragging: Signal<boolean>;
  contents: Signal<ContentRef[]>;
}

export const resizableContextId = createContextId<ResizableContext>("resizable-context");
