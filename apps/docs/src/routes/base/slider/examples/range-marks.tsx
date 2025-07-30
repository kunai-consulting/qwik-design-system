import { Slider } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root
      class="slider-root"
      isRange
      value={[25, 75]}
      min={0}
      max={100}
      step={25}
      onChange$={(values: number | [number, number]) => {
        console.log("Values changed:", values);
      }}
      onChangeEnd$={(values) => {
        console.log("Final values:", values);
      }}
    >
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range" />
        <Slider.Thumb type="start" class="slider-thumb" />
        <Slider.Thumb type="end" class="slider-thumb" />
      </Slider.Track>
      <Slider.MarkerGroup class="slider-marker-group">
        <Slider.Marker value={0}>0%</Slider.Marker>
        <Slider.Marker value={25}>25%</Slider.Marker>
        <Slider.Marker value={50}>50%</Slider.Marker>
        <Slider.Marker value={75}>75%</Slider.Marker>
        <Slider.Marker value={100}>100%</Slider.Marker>
      </Slider.MarkerGroup>
    </Slider.Root>
  );
});
