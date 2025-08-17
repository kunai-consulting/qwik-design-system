import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Render } from "../render/render";

export const ModalDescription = component$((props: PropsOf<"div">) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});
