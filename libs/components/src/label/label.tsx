import { $, type PropsOf, Slot, component$, sync$ } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

type LabelProps = PropsOf<"label">;

export const LabelBase = component$<LabelProps>((props) => {
	const handleMouseDownSync$ = sync$((event: MouseEvent) => {
		if (!event.defaultPrevented && event.detail > 1) {
			event.preventDefault();
		}
	});

	const handleMouseDown$ = $((event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.closest("button, input, select, textarea")) {
			return;
		}
	});

	return (
		<Render
			fallback="label"
			{...props}
			onMouseDown$={[
				handleMouseDownSync$,
				handleMouseDown$,
				props.onMouseDown$,
			]}
		>
			<Slot />
		</Render>
	);
});

export const Label = withAsChild(LabelBase);
