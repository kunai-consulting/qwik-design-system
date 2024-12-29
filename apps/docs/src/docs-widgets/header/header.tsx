import { component$ } from "@builder.io/qwik";
import { DocsAI } from "../docs-ai/docs-ai";

export const Header = component$(() => {
  return (
    <header>
      <DocsAI />
    </header>
  );
});
