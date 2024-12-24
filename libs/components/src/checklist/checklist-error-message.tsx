import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Checkbox } from "../mod.ts";

export const ChecklistErrorMessage = component$(
	(props: PropsOf<typeof Checkbox.ErrorMessage>) => {
		return (
			<Checkbox.ErrorMessage {...props}>
				<Slot />
			</Checkbox.ErrorMessage>
		);
	},
);
