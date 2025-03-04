import { component$, useStyles$ } from "@builder.io/qwik";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root class="slider-root">
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb class="slider-thumb">
          <Slider.Tooltip class="slider-tooltip" placement="top" />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
});
