import { component$, useStyles$ } from "@builder.io/qwik";
import { Progress } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const progress = 30;

  return (
    <Progress.Root value={progress} class="progress">
      <Progress.Label class="progress-label">Export data {progress}%</Progress.Label>
      <Progress.Track class="progress-track">
        <Progress.Indicator class="progress-indicator" />
      </Progress.Track>
    </Progress.Root>
  );
});

// internal
import styles from "./progress.css?inline";
