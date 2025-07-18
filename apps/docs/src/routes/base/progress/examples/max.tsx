import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Progress } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const initialNumTreats = 25;

  const totalTreats = useSignal(initialNumTreats);
  const treatsEaten = 20;

  const space = { margin: "1rem" };

  const increment = $(() => totalTreats.value++);
  const decrement = $(() => {
    if (totalTreats.value > 20) totalTreats.value--;
  });

  return (
    <>
      <p style={space}>🧁 Tiara's Treats</p>

      <div>
        Total treats:
        <button onClick$={decrement} style={space} type="button">
          -
        </button>
        <span>{totalTreats.value}</span>
        <button onClick$={increment} style={space} type="button">
          +
        </button>
      </div>

      <Progress.Root
        value={Number(treatsEaten)}
        max={Number(totalTreats.value)}
        class="progress"
      >
        <Progress.Label class="progress-label">Treats Progress</Progress.Label>
        <Progress.Track class="progress-track">
          <Progress.Indicator class="progress-indicator" />
        </Progress.Track>
      </Progress.Root>

      <p style={space}>Number of eaten treats: {treatsEaten}</p>
    </>
  );
});

// internal
import styles from "./progress.css?inline";
