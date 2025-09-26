import { type Signal, component$, useStyles$ } from "@builder.io/qwik";
import { Switch } from "@kunai-consulting/qwik";
import styles from "../../routes/base/switch/examples/switch-custom.css?inline";
//import styles from "./switch.css?inline";
type Props = {
  value: Signal<boolean>;
  label: string;
};
export const DocsSwitch = component$((props: Props) => {
  useStyles$(styles);

  return (
    <Switch.Root class="switch-root" bind:checked={props.value}>
      <Switch.Trigger class="switch-trigger">
        <Switch.Thumb class="switch-thumb" />
      </Switch.Trigger>
      <Switch.Label>{props.label}</Switch.Label>
    </Switch.Root>
  );
});
