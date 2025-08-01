import { Progress } from "@kunai-consulting/qwik";
import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";

export default component$(() => {
  useStyles$(styles);

  const fundraisingGoal = 10000;
  const amountRaised = 5000;
  const minGoal = useSignal(2000);

  const space = { margin: "1rem" };

  const incrementMin = $(() => {
    if (minGoal.value < amountRaised) minGoal.value += 500;
  });

  const decrementMin = $(() => {
    if (minGoal.value > 0) minGoal.value -= 500;
  });

  return (
    <div style={{ userSelect: "none", display: "contents" }}>
      <p style={space}>🎗️ Charity Fundraiser</p>

      <div>
        Initial funding:
        <button onClick$={decrementMin} style={space} type="button">
          -
        </button>
        <span>${minGoal.value}</span>
        <button onClick$={incrementMin} style={space} type="button">
          +
        </button>
      </div>

      <div style={space}>Amount raised: ${amountRaised}</div>

      <Progress.Root
        value={amountRaised}
        max={fundraisingGoal}
        min={minGoal.value}
        class="progress"
      >
        <Progress.Label class="progress-label">Fundraising Progress</Progress.Label>
        <Progress.Track class="progress-track">
          <Progress.Indicator class="progress-indicator" />
        </Progress.Track>
      </Progress.Root>

      <p style={space}>Funding goal: ${fundraisingGoal}</p>
    </div>
  );
});

// internal
import styles from "./progress.css?inline";
