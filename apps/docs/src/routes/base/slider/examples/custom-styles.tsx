import { component$, useStyles$ } from "@qwik.dev/core";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root class="slider-root" value={50} min={0} max={100} step={1}>
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb
          class="slider-thumb"
          style={{
            backgroundColor: "red",
            width: "24px",
            height: "24px",
            border: "3px solid darkred"
          }}
        />
      </Slider.Track>
    </Slider.Root>
  );
});
