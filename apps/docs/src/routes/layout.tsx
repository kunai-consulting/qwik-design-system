import { ScrollArea } from "@kunai-consulting/qwik";
import {
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useStyles$
} from "@qwik.dev/core";
import { type ContentHeading, type RequestHandler, useContent } from "@qwik.dev/router";
import { NavFooter } from "~/docs-widgets/nav-footer/nav-footer";
import { SearchModal } from "~/docs-widgets/search/search";
import { Sidebar } from "~/docs-widgets/sidebar/sidebar";
import { TOC } from "~/docs-widgets/toc/toc";
import { components } from "~/mdx/components";
import { MDXProvider } from "~/mdx/provider";
import styles from "./layout.css?inline";
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
  useStyles$(styles);
  const allHeadingsSig = useSignal<ContentHeading[]>([]);
  const { headings } = useContent();

  useContextProvider(rootContextId, {
    allHeadingsSig
  });

  return (
    <MDXProvider components={components}>
      <NavFooter />
      <SearchModal />
      <div class="svg-bg w-full h-full top-0 left-0 absolute z-[-2]" />
      <div class="w-full h-full top-0 left-0 absolute bg-gradient z-[-1]" />
      <div class="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr_300px] gap-4">
        <Sidebar />
        <main data-pagefind-body class="w-full mx-auto max-w-screen-md">
          <Slot />
        </main>
        <aside class="hidden w-60 xl:block">
          <ScrollArea.Root class="fixed h-[calc(100vh-160px)] w-60 overflow-hidden">
            <ScrollArea.Viewport class="w-full h-full">
              <TOC headings={headings || []} />
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              class="w-4 p-0.5 bg-neutral-primary"
            >
              <ScrollArea.Thumb class="h-12 w-3 bg-neutral-foreground transition-[background] duration-160 ease-out hover:bg-[#FFFFFF80]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </aside>
      </div>
    </MDXProvider>
  );
});
