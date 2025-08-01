import { Progress } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";

export default component$(() => {
  useStyles$(styles);

  const progress = 30;
  const isRendered = useSignal(false);

  return (
    <>
      <button onClick$={() => (isRendered.value = true)} type="button">
        Render the progress bar
      </button>
      {isRendered.value && (
        <Progress.Root value={progress} class="progress">
          <Progress.Label class="progress-label">Loading {progress}%</Progress.Label>
          <Progress.Track class="progress-track">
            <Progress.Indicator class="progress-indicator" />
          </Progress.Track>
        </Progress.Root>
      )}
    </>
  );
});

// internal
import styles from "./progress.css?inline";
