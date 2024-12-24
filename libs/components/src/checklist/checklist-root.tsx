import {
	component$,
	type PropsOf,
	Slot,
	useContextProvider,
	useSignal,
} from "@builder.io/qwik";
import {
	findComponent,
	processChildren,
} from "../../utils/inline-component.ts";
import { ChecklistItem } from "./checklist-item.tsx";
import { Checkbox } from "../mod.ts";
import {
	type ChecklistContext,
	checklistContextId,
} from "./checklist-context.ts";

type ChecklistRootProps = Omit<PropsOf<"div">, "onChange$"> & {
	_numItems?: number;
};

export const ChecklistRoot = ({ children, ...props }: ChecklistRootProps) => {
	let currItemIndex = 0;
	let numItems = 0;

	findComponent(ChecklistItem, (itemProps) => {
		itemProps._index = currItemIndex;
		currItemIndex++;
		numItems = currItemIndex;
	});

	processChildren(children);

	return (
		<ChecklistBase _numItems={numItems} {...props}>
			{children}
		</ChecklistBase>
	);
};

export const ChecklistBase = component$((props: ChecklistRootProps) => {
	const isAllCheckedSig = useSignal(false);
	const checkedStatesSig = useSignal<(boolean | "mixed")[]>([]);

	const context: ChecklistContext = {
		isAllCheckedSig,
		checkedStatesSig,
	};

	useContextProvider(checklistContextId, context);

	// The checkbox root to the select all checkbox
	return (
		<Checkbox.Root
			role="group"
			bind:checked={isAllCheckedSig}
			data-qds-checklist-root
			{...props}
		>
			<Slot />
		</Checkbox.Root>
	);
});
