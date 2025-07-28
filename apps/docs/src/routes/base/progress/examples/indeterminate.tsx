import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Progress } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const progressSig = useSignal(null);

  return (
    <Progress.Root value={progressSig.value} class="progress">
      <Progress.Label class="progress-label">Loading...</Progress.Label>
      <Progress.Track class="progress-track">
        <Progress.Indicator class="progress-indicator indeterminate" />
      </Progress.Track>
    </Progress.Root>
  );
});

// internal
import styles from "./progress.css?inline";
