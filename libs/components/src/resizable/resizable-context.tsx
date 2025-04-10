import { type QRL, type Signal, createContextId } from "@builder.io/qwik";

export interface PanelRef {
  ref: Signal<HTMLElement | undefined>;
  onResize$?: QRL<(size: number) => void>;
  onCollapse$?: QRL<() => void>;
  onExpand$?: QRL<() => void>;
  _index: number;
}

export interface ResizableContext {
  orientation: Signal<"horizontal" | "vertical">;
  disabled: Signal<boolean>;
  startPosition: Signal<number | null>;
  isDragging: Signal<boolean>;
  initialSizes: Signal<{ [key: string]: number }>;
  panels: Signal<PanelRef[]>;
  storageKey: Signal<string | undefined>;
  saveState: QRL<(sizes: { [key: number]: number }) => void>;
}

export const resizableContextId = createContextId<ResizableContext>("resizable-context");
