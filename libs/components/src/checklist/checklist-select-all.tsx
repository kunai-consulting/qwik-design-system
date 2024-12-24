import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Checkbox } from "../mod.ts";

export const ChecklistSelectAll = component$(
	(props: PropsOf<typeof Checkbox.Trigger>) => {
		return (
			<Checkbox.Trigger data-qds-checklist-select-all-trigger {...props}>
				<Slot />
			</Checkbox.Trigger>
		);
	},
);
