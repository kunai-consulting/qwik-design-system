import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export const TreeGroupBase = component$((props: PropsOf<'div'>) => {
    return (
        <Render role="group" fallback="div" {...props}>
               <Slot />
        </Render>
    )
})

export const TreeGroup = withAsChild(TreeGroupBase);