import { component$, isServer, useSignal, useTask$ } from "@qwik.dev/core";

export default component$(() => {
  const isClicked = useSignal(false);
  const environmentText = useSignal("Hello from the server!");

  useTask$(({ track }) => {
    track(() => isClicked.value);

    // If the task is running on the server, don't do anything
    if (isServer) return;

    environmentText.value = "Hello from the browser!";
  });

  console.log("Notice my log doesn't show up when you click!");

  return (
    <>
      <button type="button" onClick$={() => (isClicked.value = true)}>
        Click me
      </button>

      <div>The text is: {environmentText.value}</div>
    </>
  );
});
