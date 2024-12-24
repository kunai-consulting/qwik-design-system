import {
	$,
	component$,
	type PropsOf,
	Slot,
	sync$,
	useComputed$,
	useContext,
} from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context.ts";

type CheckboxControlProps = PropsOf<"button">;

export const CheckboxTrigger = component$((props: CheckboxControlProps) => {
	const context = useContext(checkboxContextId);
	const triggerId = `${context.localId}-trigger`;
	const descriptionId = `${context.localId}-description`;
	const errorId = `${context.localId}-error`;

	const describedByLabels = useComputed$(() => {
		const labels = [];
		if (context.isDescription) {
			labels.push(descriptionId);
		}
		if (context.isErrorSig.value) {
			labels.push(errorId);
		}
		return labels.join(" ") || undefined;
	});

	const handleClick$ = $(() => {
		if (context.isCheckedSig.value === "mixed") {
			context.isCheckedSig.value = true;
		} else {
			context.isCheckedSig.value = !context.isCheckedSig.value;
		}
	});

	const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	});

	return (
		<button
			id={triggerId}
			ref={context.triggerRef}
			type="button"
			role="checkbox"
			aria-checked={`${context.isCheckedSig.value}`}
			aria-describedby={describedByLabels ? describedByLabels.value : undefined}
			aria-invalid={context.isErrorSig.value}
			disabled={context.isDisabledSig.value}
			data-disabled={context.isDisabledSig.value ? "" : undefined}
			onKeyDown$={[handleKeyDownSync$, props.onKeyDown$]}
			onClick$={[handleClick$, props.onClick$]}
			data-checked={
				context.isCheckedSig.value && context.isCheckedSig.value !== "mixed"
					? ""
					: undefined
			}
			data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
			data-qds-checkbox-trigger
			{...props}
		>
			<Slot />
		</button>
	);
});
