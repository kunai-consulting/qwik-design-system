import {
  type Component,
  type PropsOf,
  component$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Carousel } from "@qwik-ui/headless";
import { metaGlobComponents, rawComponents } from "~/utils/component-import";

import { useLocation } from "@builder.io/qwik-city";
import { Highlight } from "./highlight";

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
    try {
      MetaGlobComponentSig.value = await metaGlobComponents[componentPath]();
      componentCodeSig.value = await rawComponents[componentPath]();
    } catch (e) {
      throw new Error(`Unable to load path ${componentPath}`);
    }
  });

  return (
    <Carousel.Root class="my-4">
      <Carousel.Pagination data-pagefind-ignore class="flex gap-2 py-4">
        <Carousel.Bullet class="data-[active]:bg-qwik-blue-800 data-[active]:!text-[#fff] p-2 rounded-md hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500">
          Preview
        </Carousel.Bullet>
        <Carousel.Bullet class="data-[active]:bg-qwik-blue-800 data-[active]:!text-[#fff] p-2 rounded-md hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500">
          Code
        </Carousel.Bullet>
      </Carousel.Pagination>

      <Carousel.Slide class="border border-qwik-neutral-900 rounded-md">
        <section class={`flex flex-col items-center py-12 px-6`}>
          {MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}
        </section>
      </Carousel.Slide>
      <Carousel.Slide class="border border-qwik-neutral-900 rounded-md overflow-clip text-sm">
        <Highlight code={componentCodeSig.value || ""} />
      </Carousel.Slide>
    </Carousel.Root>
  );
});
