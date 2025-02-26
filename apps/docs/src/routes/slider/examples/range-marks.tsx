import { component$, useStyles$ } from "@builder.io/qwik";
import { Slider } from "@kunai-consulting/qwik";
import styles from "./slider-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <Slider.Root
      class="slider-root"
      mode="range"
      value={[25, 75]}
      min={0}
      max={100}
      step={25}
      marks={[
        { value: 0, label: "0%" },
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
        { value: 100, label: "100%" }
      ]}
      onValueChange$={(values) => {
        console.log('Values changed:', values);
      }}
      onValueChangeEnd$={(values) => {
        console.log('Final values:', values);
      }}
    >
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range"/>
        <Slider.Thumb type="start" class="slider-thumb">
          <Slider.Tooltip class="slider-tooltip" placement="top" />
        </Slider.Thumb>
        <Slider.Thumb type="end" class="slider-thumb">
          <Slider.Tooltip class="slider-tooltip" placement="top" />
        </Slider.Thumb>
      </Slider.Track>
      <Slider.Marks class="slider-marks"
                    indicatorClass="slider-mark-indicator"
                    labelClass="slider-mark-label"/>
    </Slider.Root>
  );
});
