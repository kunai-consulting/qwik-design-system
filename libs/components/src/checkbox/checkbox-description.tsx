import {
	component$,
	type PropsOf,
	Slot,
	useContext,
	useTask$,
} from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context.ts";

type CheckboxDescriptionProps = PropsOf<"div">;

export const CheckboxDescription = component$(
	(props: CheckboxDescriptionProps) => {
		const context = useContext(checkboxContextId);
		const descriptionId = `${context.localId}-description`;

		useTask$(() => {
			if (!context.isDescription) {
				console.warn(
					"Qwik Design System Warning: No description prop provided to the Checkbox Root component.",
				);
			}
		});

		return (
			<div id={descriptionId} data-qds-checkbox-description {...props}>
				<Slot />
			</div>
		);
	},
);
