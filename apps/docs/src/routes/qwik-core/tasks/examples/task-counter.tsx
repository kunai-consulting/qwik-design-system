import { component$, useSignal, useTask$ } from "@builder.io/qwik";

export default component$(() => {
	const text = useSignal("");
	const count = useSignal(text.value.length);

	useTask$(({ track }) => {
		track(() => text.value);
		count.value = text.value.length;
	});

	return (
		<div>
			<textarea bind:value={text} />
			<button onClick$={() => (text.value = "")}>Clear</button>
			<button onClick$={() => (text.value = "Hello")}>Set Hello</button>
			<p>Count: {count.value}</p>
		</div>
	);
});
