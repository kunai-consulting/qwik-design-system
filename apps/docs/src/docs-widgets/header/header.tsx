import { component$ } from "@builder.io/qwik";
import { APIReference } from "../docs-ai/api";
import { DocsAI } from "../docs-ai/docs";
import { isDev } from "@builder.io/qwik/build";

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
