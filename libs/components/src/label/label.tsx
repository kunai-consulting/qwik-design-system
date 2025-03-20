import { $, type PropsOf, Slot, component$, sync$ } from "@builder.io/qwik";

type LabelProps = PropsOf<"label">;

export const Label = component$<LabelProps>((props) => {
  const handleMouseDownSync$ = sync$((event: MouseEvent) => {
    if (!event.defaultPrevented && event.detail > 1) {
      event.preventDefault();
    }
  });

  const handleMouseDown$ = $((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, select, textarea")) {
      return;
    }
  });

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: we bind the control when a label is used in a compound component
    <label
      {...props}
      onMouseDown$={[handleMouseDownSync$, handleMouseDown$, props.onMouseDown$]}
    >
      <Slot />
    </label>
  );
});
