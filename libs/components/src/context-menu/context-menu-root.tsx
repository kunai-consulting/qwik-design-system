import {
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import {
  contextMenuExtensionId,
  type ContextMenuExtension
} from "./context-menu-context";
import { DropdownRootBase, PublicDropdownRootProps } from "../dropdown/dropdown-root";

/** Root container component for the context menu */
const ContextMenuRootBase = component$<PublicDropdownRootProps>((props) => {
  // Store mouse coordinates when right-clicking
  const triggerX = useSignal(0);
  const triggerY = useSignal(0);

  // Provide the mouse position context
  const contextExtension: ContextMenuExtension = {
    triggerX,
    triggerY
  };

  useContextProvider(contextMenuExtensionId, contextExtension);

  const { onOpenChange$, ...rest } = props;

  return (
    <DropdownRootBase {...rest} onOpenChange$={onOpenChange$} data-qds-context-menu-root>
      <Slot />
    </DropdownRootBase>
  );
});

export const ContextMenuRoot = withAsChild(ContextMenuRootBase, (props) => {
  resetIndexes("context-menu");
  return props;
});
