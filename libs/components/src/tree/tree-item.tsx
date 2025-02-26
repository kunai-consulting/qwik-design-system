import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export const TreeItemBase = component$((props: PropsOf<'div'>) => {
    return (
        <Render role="treeitem" fallback="div" {...props}>
            <Slot />
        </Render>
    )
})

export const TreeItem = withAsChild(TreeItemBase);