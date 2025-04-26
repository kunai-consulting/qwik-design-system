import { component$, useStyles$ } from "@builder.io/qwik";
import { Toggle } from "@kunai-consulting/qwik";
import { LuItalic } from "@qwikest/icons/lucide";
import styles from "./toggle.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-root" aria-label="Toggle Italic (disabled)" disabled>
      <LuItalic />
    </Toggle.Root>
  );
});
