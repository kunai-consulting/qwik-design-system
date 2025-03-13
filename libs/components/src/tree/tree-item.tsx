import {
  $,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  sync$,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { TreeRootContextId } from "./tree-root";
import { CollapsibleRootBase } from "../collapsible/collapsible-root";

type TreeItemContext = {
  id: string;
  level: number;
};

export const itemContextId = createContextId<TreeItemContext>("tree-item");

interface TreeItemProps extends PropsOf<typeof CollapsibleRootBase> {
  _index?: number;
  groupTrigger?: boolean;
  groupId?: string;
}

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);
  const parentContext = useContext(itemContextId, null);
  const id = useId();
  const itemRef = useSignal<HTMLElement>();
  const isOpenSig = useSignal(false);

  // default level is 1, if there's a parent, increment its level
  const level = parentContext ? parentContext.level + 1 : 1;

  const itemContext: TreeItemContext = {
    id,
    level
  };

  useContextProvider(itemContextId, itemContext);

  const currLevelSig = useComputed$(() => {
    if (!itemContext?.level) {
      return 1;
    }

    return itemContext?.level;
  });

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        break;
      }

      case "ArrowUp": {
        break;
      }

      case "Home": {
        break;
      }

      case "ArrowRight": {
        isOpenSig.value = true;
        break;
      }

      case "ArrowLeft": {
        isOpenSig.value = false;
        break;
      }

      case "End": {
        break;
      }
    }
  });

  const handleFocus$ = $((e: FocusEvent) => {
    context.currentFocusEl.value = e.target as HTMLElement;
  });

  /**
   *  Todo: Change this to a sync$ passed to the Render component once v2 is released (sync QRL serialization issue)
   *
   */
  useOnWindow(
    "keydown",
    sync$((e: KeyboardEvent) => {
      if (!(e.target as Element)?.hasAttribute("data-qds-tree-item")) return;
      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];

      if (!keys.includes(e.key)) return;

      e.preventDefault();
    })
  );

  return (
    <CollapsibleRootBase
      {...props}
      ref={itemRef}
      role="gridcell"
      bind:open={isOpenSig}
      tabIndex={itemRef.value === context.currentFocusEl.value ? 0 : -1}
      onKeyDown$={[handleKeyNavigation$, props.onKeyDown$]}
      onFocus$={[handleFocus$, props.onFocus$]}
      data-qds-tree-item
      data-level={currLevelSig.value}
      aria-level={currLevelSig.value}
      data-group
    >
      <Slot />
    </CollapsibleRootBase>
  );
});

export const TreeItem = withAsChild(TreeItemBase, (props) => {
  props._index = globalThis.treeItemCount;
  globalThis.treeItemCount++;
  return props;
});
