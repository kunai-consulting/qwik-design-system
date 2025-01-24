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
  type RequestHandler,
  useContent
} from "@builder.io/qwik-city";
import { ScrollArea } from "@kunai-consulting/qwik";
import { SearchModal } from "~/components/search";
import { Header } from "~/docs-widgets/header/header";
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
      <Header />
      <SearchModal />
      <div class="flex gap-4">
        <Sidebar />
        <main data-pagefind-body class="mx-auto max-w-screen-md">
          <Slot />
        </main>
        <aside class="hidden w-60 xl:block">
          <ScrollArea.Root class="fixed h-[calc(100vh-240px)] w-60 overflow-hidden">
            <ScrollArea.Viewport class="w-full h-full">
              <TOC headings={headings || []} />
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              class="w-4 p-0.5 bg-[#FFFFFF1F] rounded-full"
            >
              <ScrollArea.Thumb class="h-12 w-3 bg-[#FFFFFF66] rounded-full transition-[background] duration-160 ease-out hover:bg-[#FFFFFF80]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </aside>
      </div>
    </MDXProvider>
  );
});
