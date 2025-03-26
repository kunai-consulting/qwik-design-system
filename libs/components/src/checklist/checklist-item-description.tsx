import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxDescriptionBase } from "../checkbox/checkbox-description";

export const ChecklistItemDescription = component$(
	(props: PropsOf<typeof CheckboxDescriptionBase>) => {
		return (
			<CheckboxDescriptionBase {...props}>
				<Slot />
			</CheckboxDescriptionBase>
		);
	},
);
