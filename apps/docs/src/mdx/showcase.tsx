import {
  type Component,
  type PropsOf,
  component$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Tabs } from "@qwik-ui/headless";
import { metaGlobComponents, rawComponents } from "~/utils/component-import";

import { Highlight } from "./highlight";
import { isDev } from "@builder.io/qwik/build";
import { useLocation } from "@builder.io/qwik-city";

type ShowcaseProps = PropsOf<"div"> & {
  name?: string;
};

export const Showcase = component$<ShowcaseProps>(({ name, ...props }) => {
  const location = useLocation();
  const componentPath = `/src/routes${location.url.pathname}examples/${name}.tsx`;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const MetaGlobComponentSig = useSignal<Component<any>>();
  const componentCodeSig = useSignal<string>();

  useTask$(async () => {
    MetaGlobComponentSig.value = isDev
      ? await metaGlobComponents[componentPath]() // We need to call `await metaGlobComponents[componentPath]()` in development as it is `eager:false`
      : metaGlobComponents[componentPath]; // We need to directly access the `metaGlobComponents[componentPath]` expression in preview/production as it is `eager:true`
    componentCodeSig.value = isDev
      ? await rawComponents[componentPath]()
      : rawComponents[componentPath];
  });

  return (
    <Tabs.Root {...props}>
      <Tabs.List class="mt-4 flex flex-row gap-6">
        <Tabs.Tab>Preview</Tabs.Tab>
        <Tabs.Tab>Code</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel class="mt-5 rounded-lg border p-8 shadow-sm">
        <section class="flex flex-col items-center">
          {MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}
        </section>
      </Tabs.Panel>
      <Tabs.Panel class="mt-5">
        <Highlight code={componentCodeSig.value || ""} />
      </Tabs.Panel>
    </Tabs.Root>
  );
});
