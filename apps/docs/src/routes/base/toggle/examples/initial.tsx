import { component$, useStyles$ } from "@builder.io/qwik";
import { Toggle } from "@kunai-consulting/qwik";
import { LuVolume2, LuVolumeX } from "@qwikest/icons/lucide";
import styles from "./toggle.css?inline";

/**
 *  Wrapper component needed because Qwikest icons uses inline components, and you cannot serialize them through props. Once we have Qwik icons library this wrapper component will not be needed.
 */
export const VolumeComp = component$(() => {
  return <LuVolumeX />;
});

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-root" aria-label="Toggle Mute" pressed={true}>
      <Toggle.Indicator class="toggle-indicator" fallback={<VolumeComp />}>
        <LuVolume2 />
      </Toggle.Indicator>
    </Toggle.Root>
  );
});
