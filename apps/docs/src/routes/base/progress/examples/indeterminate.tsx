import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Progress } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const progressSig = useSignal(null);

  return (
    <Progress.Root value={progressSig.value} class="progress">
      <Progress.Indicator class="progress-indicator indeterminate" />
    </Progress.Root>
  );
});

// internal
import styles from "./progress.css?inline";
