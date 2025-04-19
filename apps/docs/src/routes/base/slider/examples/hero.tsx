import { component$, useStyles$ } from "@qwik.dev/core";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root class="slider-root">
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb class="slider-thumb" />
      </Slider.Track>
    </Slider.Root>
  );
});
