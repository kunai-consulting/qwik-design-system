import { component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { Toggle } from "@kunai-consulting/qwik";
import { LuStar } from "@qwikest/icons/lucide";
import styles from "./toggle.css?inline";

export default component$(() => {
  useStyles$(styles);
  const showToggleSig = useSignal(false);

  useVisibleTask$(() => {});

  return (
    <div>
      <button type="button" onClick$={() => (showToggleSig.value = true)}>
        Render Toggle
      </button>

      {showToggleSig.value && (
        <Toggle.Root class="toggle-root" aria-label="Toggle Favourite">
          <LuStar />
        </Toggle.Root>
      )}
    </div>
  );
});
