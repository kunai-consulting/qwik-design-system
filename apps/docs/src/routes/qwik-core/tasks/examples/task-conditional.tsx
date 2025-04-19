import { component$, useSignal, useTask$ } from "@qwik.dev/core";

export default component$(() => {
  const isComponentRendered = useSignal(false);

  return (
    <>
      <button type="button" onClick$={() => (isComponentRendered.value = true)}>
        Render component in browser
      </button>
      {isComponentRendered.value && <TaskComponent />}
    </>
  );
});

const TaskComponent = component$(() => {
  useTask$(() => {
    console.log("TaskComponent task running");
  });

  return <div>Component rendered!</div>;
});
