import { component$, type PropsOf, Slot, useContext } from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context.ts";
import { Label } from "../label/label.tsx";

type CheckboxLabelProps = PropsOf<"label">;

export const CheckboxLabel = component$((props: CheckboxLabelProps) => {
	const context = useContext(checkboxContextId);
	const triggerId = `${context.localId}-trigger`;

	return (
		<Label {...props} data-qds-checkbox-label for={triggerId}>
			<Slot />
		</Label>
	);
});
