import {
	type PropsOf,
	type QRL,
	type Signal,
	Slot,
	component$,
	useComputed$,
	useContextProvider,
	useId,
	useSignal,
	useTask$,
} from "@builder.io/qwik";
import { useBoundSignal } from "../../utils/bound-signal";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type CheckboxContext, checkboxContextId } from "./checkbox-context";

export type PublicCheckboxRootProps<T extends boolean | "mixed" = boolean> = {
	"bind:checked"?: Signal<boolean | "mixed">;
	/** Initial checked state of the checkbox */
	checked?: T;
	/** Event handler called when the checkbox state changes */
	onChange$?: QRL<(checked: T) => void>;
	/** Whether the checkbox is disabled */
	disabled?: boolean;
	/** Whether the checkbox has a description */
	description?: boolean;
	/** Name attribute for the hidden input element */
	name?: string;
	/** Whether the checkbox is required */
	required?: boolean;
	/** Value attribute for the hidden input element */
	value?: string;
} & Omit<PropsOf<"div">, "onChange$">;

// changing checkbox root

/** Root component that provides context and state management for the checkbox */
export const CheckboxRootBase = component$((props: PublicCheckboxRootProps) => {
	const {
		"bind:checked": givenCheckedSig,
		onClick$,
		onChange$,
		description,
		name,
		required,
		value,
		...rest
	} = props;

	const checkedPropSig = useComputed$(() => props.checked);
	const isCheckedSig = useBoundSignal<boolean | "mixed">(
		// 2 way binding
		givenCheckedSig,
		// initial value
		givenCheckedSig?.value ?? checkedPropSig.value ?? false,
		// value based signal
		checkedPropSig,
	);

	const isInitialLoadSig = useSignal(true);
	const isDisabledSig = useComputed$(() => props.disabled);
	const isErrorSig = useSignal(false);
	const localId = useId();
	const triggerRef = useSignal<HTMLButtonElement>();
	const context: CheckboxContext = {
		isCheckedSig,
		isDisabledSig,
		localId,
		description,
		name,
		required,
		value,
		isErrorSig,
		triggerRef,
	};

	useContextProvider(checkboxContextId, context);

	useTask$(async function handleChange({ track, cleanup }) {
		track(() => isCheckedSig.value);

		if (isInitialLoadSig.value) return;

		await onChange$?.(isCheckedSig.value as boolean);

		cleanup(() => {
			isInitialLoadSig.value = false;
		});
	});

	useTask$(({ track }) => {
		track(() => isCheckedSig.value);

		console.log("is checked: ", isCheckedSig.value);
	});

	return (
		<Render
			{...rest}
			fallback="div"
			// Identifier for the root checkbox container
			data-qds-checkbox-root
			// Indicates whether the checkbox is disabled
			data-disabled={context.isDisabledSig.value ? "" : undefined}
			aria-disabled={context.isDisabledSig.value ? "true" : "false"}
			// Indicates whether the checkbox is checked
			data-checked={context.isCheckedSig.value ? "" : undefined}
			// Indicates whether the checkbox is in an indeterminate state
			data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
		>
			<Slot />
		</Render>
	);
});

export const CheckboxRoot = withAsChild(CheckboxRootBase);
