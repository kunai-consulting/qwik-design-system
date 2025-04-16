import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Switch } from "@kunai-consulting/qwik";
import styles from "./switch-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isCheckedSig = useSignal(true);

  return (
    <div>
      <Switch.Root class="switch-root" bind:checked={isCheckedSig}>
        <Switch.Control class="switch-control">
          <Switch.Thumb class="switch-thumb" />
        </Switch.Control>
        <Switch.Label>Enable notifications</Switch.Label>
      </Switch.Root>

      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Status:{" "}
        {isCheckedSig.value ? "Notifications are enabled" : "Notifications are disabled"}
      </div>
    </div>
  );
});
