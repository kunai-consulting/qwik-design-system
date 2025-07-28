import { component$, useStyles$ } from "@qwik.dev/core";
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
      <Switch.Description class="switch-description">
        (Receive notifications about important updates)
      </Switch.Description>
    </Switch.Root>
  );
});
