import { component$, useStyles$ } from "@builder.io/qwik";
import { Switch } from "@kunai-consulting/qwik";
import styles from "./switch-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Switch.Root class="switch-root">
      <Switch.Control class="switch-control">
        <Switch.Thumb class="switch-thumb" />
      </Switch.Control>
      <Switch.Label>Enable notifications</Switch.Label>
      <Switch.Description class="switch-description">
        (Receive notifications about important updates)
      </Switch.Description>
    </Switch.Root>
  );
});
