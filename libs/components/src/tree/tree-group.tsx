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
import { withAsChild } from "../as-child/as-child";
import { CollapsibleRoot } from "../collapsible/collapsible-root";

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

    // default level is 1, if there's a parent, increment its level
    const level = parentContext ? parentContext.level + 1 : 1;

    const groupContext: TreeGroupContext = {
      id,
      level
    };

    useContextProvider(groupContextId, groupContext);

    return (
      <CollapsibleRoot role="row" {...props}>
        <Slot />
      </CollapsibleRoot>
    );
  }
);

export const TreeGroup = withAsChild(TreeGroupBase);
