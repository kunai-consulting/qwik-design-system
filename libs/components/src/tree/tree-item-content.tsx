import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { CollapsibleContentBase } from "../collapsible/collapsible-content";
import { withAsChild } from "../as-child/as-child";

export const TreeItemContentBase = component$(
	(props: PropsOf<typeof CollapsibleContentBase>) => {
		return (
			<CollapsibleContentBase {...props}>
				<Slot />
			</CollapsibleContentBase>
		);
	},
);

export const TreeItemContent = withAsChild(TreeItemContentBase);
