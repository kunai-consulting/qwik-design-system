import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { Anthropic } from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { AIButton } from "./ai-button";

const generateDocs = server$(async (route: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const examplesPath = resolve(process.cwd(), `src/routes/${route}/examples`);
  const examples = fs
    .readdirSync(examplesPath)
    .filter((f) => f.endsWith(".tsx"))
    .map((file) => ({
      name: file.replace(".tsx", ""),
      content: fs.readFileSync(resolve(examplesPath, file), "utf-8")
    }));

  const apiPath = resolve(process.cwd(), `src/routes/${route}/auto-api/api.ts`);
  const api = fs.readFileSync(apiPath, "utf-8");

  const docsPath = resolve(process.cwd(), `src/routes/${route}/index.mdx`);
  let existingDocs = "";
  try {
    existingDocs = fs.readFileSync(docsPath, "utf-8");
  } catch (e) {
    console.log("e", e);
  }

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `You are a technical writer creating component documentation in MDX format.

Required sections and order:
1. Title (H1) and brief description
2. Basic usage with hero example
3. Anatomy section using <AnatomyTable /> component
4. Component state examples (uncontrolled, reactive, disabled)
5. Additional examples grouped by category
6. API reference section at the end using <APITable api={api} />

Rules:
- Use <Showcase name="example-name" /> to reference examples
- Group related examples under appropriate headings
- Keep descriptions clear and concise
- Include practical use cases and tips
- DO NOT wrap code in MDX code blocks
- If good documentation already exists, preserve it and only add missing sections
- Use the <AnatomyTable /> component for the anatomy section
- End with API reference

Existing docs: ${existingDocs}

Component name: ${route}
API reference: ${api}
Example files: ${examples.map((e) => `\n--- ${e.name}.tsx ---\n${e.content}`).join("\n")}

Generate or enhance the MDX documentation while preserving any existing high-quality content.`
      }
    ]
  });

  const mdxContent = response.content[0].type === "text" ? response.content[0].text : "";

  fs.writeFileSync(docsPath, mdxContent, "utf-8");

  return ["Documentation generated successfully"];
});

export const DocsAI = component$(() => {
  const isGenerating = useSignal(false);
  const status = useSignal("");
  const loc = useLocation();
  const route = loc.url.pathname.split("/").filter(Boolean)[0];

  return (
    <AIButton
      onClick$={async () => {
        isGenerating.value = true;
        status.value = "Generating...";
        try {
          await generateDocs(route);
        } finally {
          isGenerating.value = false;
          status.value = "";
        }
      }}
      disabled={isGenerating.value}
    >
      {isGenerating.value ? status.value : "Generate Docs"}
    </AIButton>
  );
});
