import { component$, PropsOf, Slot } from "@builder.io/qwik";

type RootProps = PropsOf<'div'>;

export const ScrollAreaRoot = component$<RootProps>((props) => {
  return (
    <div {...props} data-scroll-area-root>
      <Slot />
    </div>
  )
})