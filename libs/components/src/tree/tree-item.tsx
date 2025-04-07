import {
  $,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  sync$,
  useContext,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { TreeRootContextId } from "./tree-root";
import { CollapsibleRootBase } from "../collapsible/collapsible-root";
import { useTree } from "./use-tree";

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

  const { getCurrentLevel } = useTree();

  const level = getCurrentLevel(parentContext?.level);

  const itemContext: TreeItemContext = {
    id,
    level
  };

  useContextProvider(itemContextId, itemContext);

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
      onFocus$={[handleFocus$, props.onFocus$]}
      data-qds-tree-item
      data-level={level}
      aria-level={level}
      data-group
    >
      <Slot />
    </CollapsibleRootBase>
  );
});

export const TreeItem = withAsChild(TreeItemBase);
