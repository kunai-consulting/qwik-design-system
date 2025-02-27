import { component$ } from "@builder.io/qwik";
import { isDev } from "@builder.io/qwik/build";
import { APIReference } from "../docs-ai/api";
import { DocsAI } from "../docs-ai/docs";

export const Header = component$(() => {
  return (
    <header class="flex gap-2">
      {isDev && (
        <>
          <APIReference />
          <DocsAI />
          <a href="https://github.com/kunai-consulting/qwik-design-system">
            GitHub
          </a>
        </>
      )}
    </header>
  );
});
