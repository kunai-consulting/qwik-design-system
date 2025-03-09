import { type Component, component$, useSignal, useTask$ } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { isDev } from "@qwik.dev/core/build";
import { metaGlobComponents } from "./component-imports";

/**
 * This component takes docs examples and renders them in isolation. Until a more robust integration with playwright for component testing is available, this is our current solution for testing components.
 * */
export const IsolateTest = component$(() => {
  const location = useLocation();

  const componentPath = `${location.params.kit}/${location.params.component}/examples/${location.params.example}.tsx`;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const MetaGlobComponentSig = useSignal<Component<any>>();

  useTask$(async () => {
    try {
      // @ts-ignore
      MetaGlobComponentSig.value = await metaGlobComponents[componentPath]();
    } catch (e) {
      throw new Error(`Unable to load path ${componentPath}`);
    }
  });

  return <>{MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}</>;
});
