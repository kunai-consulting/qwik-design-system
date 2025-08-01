import { Progress } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";

export default component$(() => {
  useStyles$(styles);

  const progressSig = useSignal(30);

  return (
    <>
      <Progress.Root bind:value={progressSig} class="progress">
        <Progress.Label class="progress-label">
          Progress: {progressSig.value}%
        </Progress.Label>
        <Progress.Track class="progress-track">
          <Progress.Indicator class="progress-indicator" />
        </Progress.Track>
      </Progress.Root>
      <button onClick$={() => (progressSig.value = 70)} type="button">
        Change progress
      </button>
    </>
  );
});

// internal
import styles from "./progress.css?inline";
