import { component$, useStyles$ } from "@builder.io/qwik";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root
      class="slider-root"
      mode="single"
      value={50}
      min={0}
      max={100}
      step={1}
      onValueChange$={(value) => {
        console.log("Value changed:", value);
      }}
      onValueChangeEnd$={(value) => {
        console.log("Final value:", value);
      }}
    >
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb class="slider-thumb">
          <Slider.Tooltip class="slider-tooltip" placement="bottom" />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
});
