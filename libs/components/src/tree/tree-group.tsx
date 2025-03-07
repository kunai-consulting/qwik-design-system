import {
  type Component,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useId
} from "@builder.io/qwik";
import { Collapsible } from "@qwik-ui/headless";
import { withAsChild } from "../as-child/as-child";

type TreeGroupContext = {
  id: string;
};

export const groupContextId = createContextId<TreeGroupContext>("tree-group");

export const TreeGroupBase: Component<PropsOf<typeof Collapsible.Root>> = component$(
  (props) => {
    console.log("TREE GROUP");

    const id = useId();

    const groupContext: TreeGroupContext = {
      id
    };

    useContextProvider(groupContextId, groupContext);

    return (
      <Collapsible.Root {...props}>
        <Slot />
      </Collapsible.Root>
    );
  }
);

export const TreeGroup = withAsChild(TreeGroupBase, false);
