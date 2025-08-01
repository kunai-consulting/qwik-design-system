import { $, type PropsOf, Slot, component$, sync$ } from "@qwik.dev/core";
import { Render } from "../render/render";

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
    <Render
      fallback="label"
      {...props}
      onMouseDown$={[handleMouseDownSync$, handleMouseDown$, props.onMouseDown$]}
    >
      <Slot />
    </Render>
  );
});
