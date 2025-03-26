import {
	type Component,
	component$,
	useSignal,
	useTask$,
	useComputed$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { metaGlobComponents } from "./component-imports";

/**
 * This component takes docs examples and renders them in isolation. Until a more robust integration with playwright for component testing is available, this is our current solution for testing components.
 * */
export const IsolateTest = component$(() => {
	const loc = useLocation();

	const componentPath = useComputed$(
		() =>
			`${loc.params.kit}/${loc.params.component}/examples/${loc.params.example}.tsx`,
	);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const MetaGlobComponentSig = useSignal<Component<any>>();

	useTask$(async ({ track }) => {
		track(() => componentPath.value);

		try {
			// @ts-ignore
			MetaGlobComponentSig.value = await (
				metaGlobComponents as Record<string, () => Promise<Component<any>>>
			)[componentPath.value]();
		} catch (e) {
			throw new Error(`Unable to load path ${componentPath.value}`);
		}
	});

	const Comp = MetaGlobComponentSig.value;

	return Comp ? <Comp /> : null;
});
