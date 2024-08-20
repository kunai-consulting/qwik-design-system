import {
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

  // components that need a dark background in the example
  const darkBgComponents = ["feed"];
  const previewBgColor = darkBgComponents.some((c) => componentPath.includes(c))
    ? "bg-slate-950"
    : "bg-white";

  return (
    <Carousel.Root>
      <Carousel.Pagination>
        <Carousel.Bullet>Preview</Carousel.Bullet>
        <Carousel.Bullet>Code</Carousel.Bullet>
      </Carousel.Pagination>

      <Carousel.Slide>
        <section class={`${previewBgColor} flex flex-col items-center py-12`}>
          {MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}
        </section>
      </Carousel.Slide>
      <Carousel.Slide>
        <Highlight code={componentCodeSig.value || ""} />
      </Carousel.Slide>
    </Carousel.Root>
  );
});
