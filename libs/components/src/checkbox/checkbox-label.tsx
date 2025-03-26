import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";
import { withAsChild } from "../as-child/as-child";
import { LabelBase } from "../label/label";
type PublicCheckboxLabelProps = PropsOf<typeof LabelBase>;
/** Label component for the checkbox */
export const CheckboxLabelBase = component$(
	(props: PublicCheckboxLabelProps) => {
		const context = useContext(checkboxContextId);
		const triggerId = `${context.localId}-trigger`;
		return (
			// Identifier for the checkbox label element
			<LabelBase {...props} data-qds-checkbox-label for={triggerId}>
				<Slot />
			</LabelBase>
		);
	},
);

export const CheckboxLabel = withAsChild(CheckboxLabelBase);
