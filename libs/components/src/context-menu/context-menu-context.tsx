import { type Signal, createContextId } from "@builder.io/qwik";

export type ContextMenuExtension = {
  /** Mouse X position when context menu was triggered */
  triggerX: Signal<number>;
  /** Mouse Y position when context menu was triggered */
  triggerY: Signal<number>;
};

export const contextMenuExtensionId = createContextId<ContextMenuExtension>(
  "context-menu-extension"
);
