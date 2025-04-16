import { component$, useStyles$ } from "@builder.io/qwik";
import { Switch } from "@kunai-consulting/qwik";
import styles from "./switch-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <form>
      <Switch.Root class="switch-root" name="notifications" value="enabled">
        <Switch.Control class="switch-control">
          <Switch.Thumb class="switch-thumb" />
        </Switch.Control>
        <Switch.Label>Enable notifications</Switch.Label>
      </Switch.Root>
    </form>
  );
});
