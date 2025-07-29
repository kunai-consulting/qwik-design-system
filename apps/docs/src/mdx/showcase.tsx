import { Tabs } from "@kunai-consulting/qwik";
import {
  $,
  type Component,
  type PropsOf,
  component$,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { metaGlobComponents, rawComponents } from "~/utils/component-import";

import { useLocation } from "@qwik.dev/router";
import { Highlight } from "./highlight";
import { createStackblitzProject } from "./stackblitz";

type ShowcaseProps = PropsOf<"div"> & {
  name?: string;
};

export const Showcase = component$<ShowcaseProps>(({ name, ...props }) => {
  const location = useLocation();
  const componentPath = `/src/routes${location.url.pathname}examples/${name}.tsx`;
  const id = useId();
  const stackblitzContainerId = `stackblitz-container-${id}`;
  const stackblitzParentContainerId = `stackblitz-parent-${id}`;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const MetaGlobComponentSig = useSignal<Component<any>>();
  const componentCodeSig = useSignal<string>();

  const openStackblitz$ = $(async () => {
    await createStackblitzProject(
      componentCodeSig.value || "",
      stackblitzParentContainerId,
      stackblitzContainerId
    );
  });

  useTask$(async () => {
    try {
      MetaGlobComponentSig.value = await metaGlobComponents[componentPath]();
      componentCodeSig.value = await rawComponents[componentPath]();
    } catch (e) {
      throw new Error(`Unable to load path ${componentPath}`);
    }
  });

  return (
    <Tabs.Root class="my-4 border-neutral-primary border">
      <Tabs.List data-pagefind-ignore class="flex bg-neutral-accent">
        <Tabs.Trigger class="data-selected:bg-qwik-blue-800 data-selected:!text-[#fff] p-2 hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500">
          Preview
        </Tabs.Trigger>
        <Tabs.Trigger class="data-selected:bg-qwik-blue-800 data-selected:!text-[#fff] p-2 hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500">
          Code
        </Tabs.Trigger>
        <Tabs.Trigger
          onClick$={openStackblitz$}
          class="data-selected:bg-qwik-blue-800 data-selected:!text-[#fff] p-2 hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500"
        >
          New Project
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content class="border border-neutral-primary">
        <section class={"flex flex-col items-center py-12 px-6 *:flex-wrap"}>
          {MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}
        </section>
      </Tabs.Content>
      <Tabs.Content class="border border-neutral-primary overflow-clip text-sm">
        <Highlight code={componentCodeSig.value || ""} />
      </Tabs.Content>
      <Tabs.Content class="border border-neutral-primary overflow-clip text-sm">
        <section
          id={stackblitzParentContainerId}
          class={"flex flex-col items-center *:flex-wrap"}
        >
          <div id={stackblitzContainerId} />
        </section>
      </Tabs.Content>
    </Tabs.Root>
  );
});
