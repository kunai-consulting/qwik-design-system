import { type Signal, createContextId } from "@builder.io/qwik";

export interface ResizableContext {
  orientation: Signal<"horizontal" | "vertical">;
  disabled: Signal<boolean>;
  startPosition: Signal<number | null>;
  isDragging: Signal<boolean>;
  initialSizes: Signal<{ [key: string]: number }>;
}

export const resizableContextId = createContextId<ResizableContext>("resizable-context");
