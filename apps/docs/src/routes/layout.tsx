import {
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import {
  type ContentHeading,
  useContent,
  type RequestHandler
} from "@builder.io/qwik-city";
import { Sidebar } from "~/docs-widgets/sidebar/sidebar";
import { TOC } from "~/docs-widgets/toc/toc";
import { components } from "~/mdx/components";
import { MDXProvider } from "~/mdx/provider";

type RootContext = {
  allHeadingsSig: Signal<ContentHeading[]>;
};

export const rootContextId = createContextId<RootContext>("root-context");

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5
  });
};

export default component$(() => {
  const allHeadingsSig = useSignal<ContentHeading[]>([]);
  const { headings } = useContent();

  useContextProvider(rootContextId, {
    allHeadingsSig
  });

  return (
    <MDXProvider components={components}>
      <div class="flex gap-4">
        <Sidebar />
        <main class="mx-auto max-w-screen-md">
          <Slot />
        </main>
        <aside class="hidden w-60 xl:block">
          <div class="fixed h-[calc(100vh-64px)] w-full  overflow-auto">
            <TOC headings={headings || []} />
          </div>
        </aside>
      </div>
    </MDXProvider>
  );
});
