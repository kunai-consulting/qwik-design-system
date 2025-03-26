import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render, withAsChild } from "@kunai-consulting/qwik";

export const DummyCompBase = component$((props: PropsOf<"div">) => {
	return (
		<Render fallback="div" {...props}>
			<Slot />
		</Render>
	);
});

export const DummyComp = withAsChild(DummyCompBase);

export default component$(() => {
	return (
		<DummyComp asChild data-from-comp>
			<span data-on-span>Hello</span>
		</DummyComp>
	);
});
