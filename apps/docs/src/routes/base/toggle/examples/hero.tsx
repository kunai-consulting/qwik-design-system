import { Toggle } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import { LuBold } from "@qwikest/icons/lucide";
import styles from "./toggle.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-root" aria-label="Toggle Bold">
      <LuBold />
    </Toggle.Root>
  );
});
