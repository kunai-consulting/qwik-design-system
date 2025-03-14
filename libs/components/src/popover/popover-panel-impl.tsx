import {
  $,
  Slot,
  component$,
  createContextId,
  useContext,
  useSignal,
  useStyles$,
  useTask$,
  type PropsOf
} from "@qwik.dev/core";

import { isServer } from "@qwik.dev/core/build";
import { popoverContextId } from "./popover-context";
import popoverStyles from "./popover.css?inline";

// We don't need a provider, that way we connect all context to the root
const ensureContextId = createContextId("qui-popover-null-context");

/**
 *
 * Portal Context in Qwik, akin to React's Portal, enables element teleportation. Rendering this component forces Qwik to parse the vDOM, enabling efficient context retrieval.
 * *
 * 1. Render on client -> don't need anything
 *
 * 2. SSR -> click -> force context the one time.
 *
 */
export const EnsuredContext = component$(() => {
  useContext(ensureContextId, null);
  return null;
});

export const HPopoverPanelImpl = component$<PropsOf<"div">>((props) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
