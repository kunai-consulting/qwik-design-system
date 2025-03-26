import {
	type PropsOf,
	Slot,
	component$,
	useContextProvider,
	useSignal,
	useTask$,
} from "@builder.io/qwik";
import { Checkbox, resetIndexes } from "..";
import { type ChecklistContext, checklistContextId } from "./checklist-context";
import { withAsChild } from "../as-child/as-child";

type PublicChecklistRootProps = Omit<PropsOf<"div">, "onChange$">;

export const ChecklistRootBase = component$(
	(props: PublicChecklistRootProps) => {
		const isAllCheckedSig = useSignal(false);
		const checkedStatesSig = useSignal<(boolean | "mixed")[]>([]);

		const context: ChecklistContext = {
			isAllCheckedSig,
			checkedStatesSig,
		};

		useContextProvider(checklistContextId, context);

		useTask$(({ track }) => {
			track(() => isAllCheckedSig.value);

			console.log("is all checked: ", isAllCheckedSig.value);
		});

		// The checkbox root to the select all checkbox
		return (
			<Checkbox.Root
				role="group"
				bind:checked={isAllCheckedSig}
				// Identifies the root container element of the checklist component
				data-qds-checklist-root
				{...props}
			>
				<Slot />
			</Checkbox.Root>
		);
	},
);

export const ChecklistRoot = withAsChild(ChecklistRootBase, (props) => {
	resetIndexes("qds-checklist");

	return props;
});
