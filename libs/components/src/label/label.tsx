import { $, type HTMLElementAttrs, Slot, component$, sync$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type LabelProps = HTMLElementAttrs<"label">;

export const LabelBase = component$<LabelProps>((props) => {
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

export const Label = withAsChild(LabelBase);
