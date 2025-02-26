import {component$, useStyles$} from "@builder.io/qwik";
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
      step={20}
      marks={[
        { value: 0, label: "Very Low" },
        { value: 20, label: "Low" },
        { value: 40, label: "Medium" },
        { value: 60, label: "High" },
        { value: 80, label: "Higher" },
        { value: 100, label: "Top" }
      ]}
    >
      <Slider.Track class="slider-track">
        <Slider.Range class="slider-range"/>
        <Slider.Thumb class="slider-thumb">
          <Slider.Tooltip class="slider-tooltip" placement="right" />
        </Slider.Thumb>
      </Slider.Track>
      <Slider.Marks class="slider-marks"
                    indicatorClass="slider-mark-indicator"
                    labelClass="slider-mark-label"/>
    </Slider.Root>
  );
});
