import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useId
} from "@builder.io/qwik";
import { CollapsibleRoot } from "../collapsible/collapsible-root";
import { withAsChild } from "../as-child/as-child";

type TreeGroupContext = {
  id: string;
};

export const groupContextId = createContextId<TreeGroupContext>("tree-group");

export const TreeGroupBase: Component<PropsOf<typeof CollapsibleRoot>> = component$(
  (props) => {
    console.log("TREE GROUP");

    const id = useId();

    const groupContext: TreeGroupContext = {
      id
    };

    useContextProvider(groupContextId, groupContext);

    return (
      <CollapsibleRoot role="row" {...props}>
        <Slot />
      </CollapsibleRoot>
    );
  }
);

export const TreeGroup = withAsChild(TreeGroupBase, false);
