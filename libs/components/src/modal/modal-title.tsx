import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Render } from "../render/render";

export const ModalTitle = component$((props: PropsOf<"div">) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});
