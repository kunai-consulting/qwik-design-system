import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Checkbox } from "../mod.ts";

export const ChecklistItemDescription = component$(
	(props: PropsOf<typeof Checkbox.Description>) => {
		return (
			<Checkbox.Description {...props}>
				<Slot />
			</Checkbox.Description>
		);
	},
);
