import { component$, useStyles$ } from "@builder.io/qwik";
import { Switch } from "@kunai-consulting/qwik";
import styles from "./switch-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Switch.Root class="switch-root">
      <Switch.Trigger class="switch-trigger">
        <Switch.Thumb class="switch-thumb" />
      </Switch.Trigger>
      <Switch.Label>Enable notifications</Switch.Label>
    </Switch.Root>
  );
});
