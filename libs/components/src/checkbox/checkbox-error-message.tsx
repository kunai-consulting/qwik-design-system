import {
	type PropsOf,
	Slot,
	component$,
	useContext,
	useTask$,
} from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";
type PublicCheckboxErrorMessageProps = PropsOf<"div">;
/** A component that displays error messages for a checkbox */
export const CheckboxErrorMessageBase = component$(
	(props: PublicCheckboxErrorMessageProps) => {
		const context = useContext(checkboxContextId);
		const errorId = `${context.localId}-error`;
		useTask$(({ cleanup }) => {
			context.isErrorSig.value = true;
			cleanup(() => {
				context.isErrorSig.value = false;
			});
		});
		return (
			// Identifier for the checkbox error message element
			<Render
				fallback="div"
				id={errorId}
				data-qds-checkbox-error-message
				{...props}
			>
				<Slot />
			</Render>
		);
	},
);

export const CheckboxErrorMessage = withAsChild(CheckboxErrorMessageBase);
