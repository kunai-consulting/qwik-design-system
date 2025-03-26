import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render, withAsChild } from "@kunai-consulting/qwik";

const DummyCompBase = component$(() => {
	return (
		<div>
			<Slot />
		</div>
	);
});

const DummyComp = withAsChild(DummyCompBase);

const AsChildComp = component$((props: PropsOf<"span">) => {
	return <span {...props}>Hello</span>;
});

export default component$(() => {
	return (
		<DummyComp asChild>
			<AsChildComp>Hello</AsChildComp>
		</DummyComp>
	);
});
