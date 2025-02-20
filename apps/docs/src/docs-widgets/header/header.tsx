import { component$ } from "@qwik.dev/core";
import { isDev } from "@qwik.dev/core/build";
import { APIReference } from "../docs-ai/api";
import { DocsAI } from "../docs-ai/docs";

export const Header = component$(() => {
  return (
    <header class="flex gap-2">
      {isDev && (
        <>
          <APIReference />
          <DocsAI />
        </>
      )}
    </header>
  );
});
