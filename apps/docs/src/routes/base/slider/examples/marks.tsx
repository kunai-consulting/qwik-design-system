import { Slider } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root class="slider-root" value={50} min={0} max={100} step={20}>
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb class="slider-thumb" />
      </Slider.Track>
      <Slider.MarkerGroup class="slider-marker-group">
        <Slider.Marker value={0} class="slider-marker">
          <span class="slider-mark-label">Very Low</span>
        </Slider.Marker>
        <Slider.Marker value={20} class="slider-marker">
          <span class="slider-mark-label">Low</span>
        </Slider.Marker>
        <Slider.Marker value={40} class="slider-marker">
          <span class="slider-mark-label">Medium</span>
        </Slider.Marker>
        <Slider.Marker value={60} class="slider-marker">
          <span class="slider-mark-label">High</span>
        </Slider.Marker>
        <Slider.Marker value={80} class="slider-marker">
          <span class="slider-mark-label">Higher</span>
        </Slider.Marker>
        <Slider.Marker value={100} class="slider-marker">
          <span class="slider-mark-label">Top</span>
        </Slider.Marker>
      </Slider.MarkerGroup>
    </Slider.Root>
  );
});
