import { component$, useStyles$ } from "@builder.io/qwik";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root class="slider-root" isRange value={[30, 70]} min={0} max={100} step={1}>
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb type="start" class="slider-thumb" />
        <Slider.Thumb type="end" class="slider-thumb" />
      </Slider.Track>
    </Slider.Root>
  );
});
