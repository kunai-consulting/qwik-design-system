import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { scrollAreaContextId } from "./scroll-area-context";
import styles from "./scroll-area.css?inline";

type RootProps = PropsOf<"div">;

export const ScrollAreaRoot = component$<RootProps>((props) => {
  useStyles$(styles);
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
    <div {...props} data-qds-scroll-area-root>
      <Slot />
    </div>
  );
});
