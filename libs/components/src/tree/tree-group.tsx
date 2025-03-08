import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useId
} from "@builder.io/qwik";
import { CollapsibleRoot } from "../collapsible/collapsible-root";
import { withAsChild } from "../as-child/as-child";

type TreeGroupContext = {
  id: string;
  level: number;
};

export const groupContextId = createContextId<TreeGroupContext>("tree-group");

export const TreeGroupBase: Component<PropsOf<typeof CollapsibleRoot>> = component$(
  (props) => {
    console.log("TREE GROUP");

    const id = useId();

    const parentContext = useContext(groupContextId, null);

    // default level is 2, if there's a parent, increment its level
    const level = parentContext ? parentContext.level + 1 : 2;

    const groupContext: TreeGroupContext = {
      id,
      level
    };

    useContextProvider(groupContextId, groupContext);

    return (
      <CollapsibleRoot role="row" {...props} data-level={level}>
        <Slot />
      </CollapsibleRoot>
    );
  }
);

export const TreeGroup = withAsChild(TreeGroupBase, false);
