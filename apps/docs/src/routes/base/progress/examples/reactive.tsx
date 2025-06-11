import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Progress } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const progressSig = useSignal(30);

  return (
    <>
      <Progress.Root bind:value={progressSig} class="progress">
        <Progress.Indicator class="progress-indicator" />
      </Progress.Root>
      <button onClick$={() => (progressSig.value = 70)} type="button">
        Change progress
      </button>
    </>
  );
});

// internal
import styles from "./progress.css?inline";
