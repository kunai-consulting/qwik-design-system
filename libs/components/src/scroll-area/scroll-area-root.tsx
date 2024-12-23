import {
  component$,
  type PropsOf,
  Slot,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";

type RootProps = PropsOf<"div">;

export const ScrollAreaRoot = component$<RootProps>((props) => {
  const viewportRef = useSignal<HTMLDivElement>();
  const scrollbarRef = useSignal<HTMLDivElement>();
  const thumbRef = useSignal<HTMLDivElement>();

  const context = {
    viewportRef,
    scrollbarRef,
    thumbRef
  };

  useContextProvider(scrollAreaContextId, context);

  return (
    <div {...props} data-scroll-area-root>
      <Slot />
    </div>
  );
});
