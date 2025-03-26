import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxLabelBase } from "../checkbox/checkbox-label";

export const ChecklistItemLabel = component$(
	(props: PropsOf<typeof CheckboxLabelBase>) => {
		return (
			<CheckboxLabelBase {...props}>
				<Slot />
			</CheckboxLabelBase>
		);
	},
);
