import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Checkbox } from "../mod.ts";

export const ChecklistItemTrigger = component$(
	(props: PropsOf<typeof Checkbox.Trigger>) => {
		return (
			<Checkbox.Trigger {...props}>
				<Slot />
			</Checkbox.Trigger>
		);
	},
);
