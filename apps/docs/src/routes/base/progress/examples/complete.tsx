import { component$, useStyles$ } from "@builder.io/qwik";
import { Progress } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  return (
    <Progress.Root value={100} class="progress">
      <Progress.Indicator class="progress-indicator" />
    </Progress.Root>
  );
});

// internal
import styles from "./progress.css?inline";
