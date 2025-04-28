import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
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
  const isPressedSig = useSignal(true);

  return (
    <div>
      <Toggle.Root
        class="toggle-root"
        aria-label="Toggle Mute"
        bind:pressed={isPressedSig}
      >
        <Toggle.Indicator class="toggle-indicator" fallback={<VolumeComp />}>
          <LuVolume2 />
        </Toggle.Indicator>
      </Toggle.Root>

      <button
        type="button"
        onClick$={() => {
          isPressedSig.value = !isPressedSig.value;
        }}
      >
        Toggle Signal
      </button>

      <p>Bound Signal: {isPressedSig.value.toString()}</p>
    </div>
  );
});
