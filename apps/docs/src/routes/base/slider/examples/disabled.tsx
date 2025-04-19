import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isDisabled = useSignal(true);

  return (
    <div>
      <Slider.Root
        class="slider-root"
        value={50}
        min={0}
        max={100}
        step={1}
        disabled={isDisabled}
        onChange$={(value: number | [number, number]) => {
          console.log("This should not be called when disabled:", value);
        }}
      >
        <Slider.Track class="slider-track">
          <Slider.Range class="slider-range" />
          <Slider.Thumb class="slider-thumb" />
        </Slider.Track>
      </Slider.Root>
      <button
        type="button"
        onClick$={() => {
          isDisabled.value = !isDisabled.value;
        }}
      >
        Toggle Disabled
      </button>
    </div>
  );
});
