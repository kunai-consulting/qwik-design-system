import {
  $,
  type Component,
  type PropsOf,
  component$,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { Carousel } from "@qwik-ui/headless";
import { metaGlobComponents, rawComponents } from "~/utils/component-import";

import { useLocation } from "@builder.io/qwik-city";
import { Highlight } from "./highlight";
import { createStackblitzProject } from "./stackblitz";

type ShowcaseProps = PropsOf<"div"> & {
  name?: string;
};

export const Showcase = component$<ShowcaseProps>(({ name, ...props }) => {
  const location = useLocation();
  const componentPath = `/src/routes${location.url.pathname}examples/${name}.tsx`;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const MetaGlobComponentSig = useSignal<Component<any>>();
  const componentCodeSig = useSignal<string>();

  const openStackblitz$ = $(async (_: PointerEvent, element: HTMLButtonElement) => {
    const carouselContainer = element.closest(".carousel-container");
    if (!carouselContainer) return;

    // A child section with the class stackblitz-container-parent should always exist
    const stackblitzContainerParent = carouselContainer.querySelector(
      ".stackblitz-container-parent"
    ) as HTMLElement;

    await createStackblitzProject(
      componentCodeSig.value || "",
      stackblitzContainerParent
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
    <Carousel.Root class="my-4 border-neutral-primary border carousel-container">
      <Carousel.Pagination data-pagefind-ignore class="flex bg-neutral-accent">
        <Carousel.Bullet class="data-[active]:bg-qwik-blue-800 data-[active]:!text-[#fff] p-2 hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500">
          Preview
        </Carousel.Bullet>
        <Carousel.Bullet class="data-[active]:bg-qwik-blue-800 data-[active]:!text-[#fff] p-2 hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500">
          Code
        </Carousel.Bullet>
        <Carousel.Bullet
          onClick$={openStackblitz$}
          class="data-[active]:bg-qwik-blue-800 data-[active]:!text-[#fff] p-2 hover:bg-qwik-blue-200 hover:text-qwik-neutral-700 transition-colors outline-qwik-blue-500"
        >
          New Project
        </Carousel.Bullet>
      </Carousel.Pagination>

      <Carousel.Slide class="border border-neutral-primary">
        <section class={"flex flex-col items-center py-12 px-6 *:flex-wrap"}>
          {MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}
        </section>
      </Carousel.Slide>
      <Carousel.Slide class="border border-neutral-primary overflow-clip text-sm">
        <Highlight code={componentCodeSig.value || ""} />
      </Carousel.Slide>
      <Carousel.Slide class="border border-neutral-primary overflow-clip text-sm">
        <section
          class={"stackblitz-container-parent flex flex-col items-center *:flex-wrap"}
        >
          <div class="stackblitz-container" />
        </section>
      </Carousel.Slide>
    </Carousel.Root>
  );
});
