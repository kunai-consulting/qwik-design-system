import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { Anthropic } from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { AIButton } from "./ai-button";

const generateDocs = server$(async (route: string) => {
  try {
    console.log("Starting docs generation for route:", route);

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    const examplesPath = resolve(process.cwd(), `src/routes/${route}/examples`);
    const examples = fs
      .readdirSync(examplesPath)
      .filter((f) => f.endsWith(".tsx"))
      .map((file) => ({
        name: file,
        content: fs.readFileSync(resolve(examplesPath, file), "utf-8")
      }));

    const formattedExamples = examples
      .map(
        (e) => `=== ${e.name} ===
${e.content}
`
      )
      .join("\n");

    console.log("Found examples:", formattedExamples);

    if (!fs.existsSync(examplesPath)) {
      throw new Error(`No examples folder found for ${route}`);
    }

    const docsPath = resolve(process.cwd(), `src/routes/${route}/index.mdx`);
    let existingDocs = "";
    try {
      existingDocs = fs.readFileSync(docsPath, "utf-8");
      console.log("Found existing docs");
    } catch (e) {
      console.log("No existing docs found");
    }

    const updates = [];

    const componentPath = resolve(process.cwd(), `../../libs/components/src/${route}`);
    const componentFiles = fs
      .readdirSync(componentPath)
      .filter((f) => f.endsWith(".tsx"))
      .map((file) => fs.readFileSync(resolve(componentPath, file), "utf-8"));

    const formattedComponents = Object.entries(componentFiles)
      .map(
        ([filename, content]) => `=== ${filename} ===
${content}
`
      )
      .join("\n");

    console.log("formattedComponents", formattedComponents);

    // 1. overview
    const introResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Analyze this checkbox component implementation and write a minimal introduction.
Component implementation:
${formattedComponents}

Examples:
${formattedExamples}

Required format:
import { api } from "./auto-api/api";

# Checkbox
[One-line description based on the actual implementation]

<Showcase name="hero" />

## Anatomy

<AnatomyTable />

Rules:
- Must start with the api import
- Description must be based on the actual code
- Focus on the component's core form control purpose
- Keep existing code blocks if present`
        }
      ]
    });

    // 2. component state
    const stateResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Document the core state management examples.
        Component implementation: ${JSON.stringify(componentFiles)}
        Examples: ${examples.map((e) => `\n--- ${e.name} ---\n${e.content}`).join("\n")}
        
        Required section:
        ## Component State

        Analyze the examples and group them based on their core state management patterns.

        Rules:
        - One clear sentence per example
        - Use note blocks for important details: > [!NOTE] Detail here
        - Use <Showcase name="example-name" /> for examples
        - Only include examples that actually exist
        - Don't wrap <Showcase /> components in code blocks
        - Keep existing code blocks if present`
        }
      ]
    });

    // 3. improvise examples
    const additionalResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Organize the remaining examples based on their relationships.
        Component implementation: ${JSON.stringify(componentFiles)}
        Examples: ${examples.map((e) => `\n--- ${e.name} ---\n${e.content}`).join("\n")}
        
        Rules:
        - Analyze examples and group by related functionality
        - Create logical section headings based on the examples
        - One sentence description per example
        - Use note blocks for important details
        - Use <Showcase name="example-name" /> for examples
        - Don't wrap <Showcase /> components in code blocks
        - Keep existing code blocks if present`
        }
      ]
    });

    const mdxContent = [
      introResponse.content[0].type === "text" ? introResponse.content[0].text : "",
      stateResponse.content[0].type === "text" ? stateResponse.content[0].text : "",
      additionalResponse.content[0].type === "text"
        ? additionalResponse.content[0].text
        : "",
      "<APITable api={api} />"
    ].join("\n\n");

    fs.writeFileSync(docsPath, mdxContent);
    updates.push("Documentation updated");

    return updates;
  } catch (error) {
    console.error("Error generating docs:", error);
    return [
      `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
    ];
  }
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
          const updates = await generateDocs(route);
          status.value = updates[updates.length - 1] || "";
        } finally {
          isGenerating.value = false;
        }
      }}
      disabled={isGenerating.value}
    >
      {isGenerating.value ? status.value : "Generate Docs"}
    </AIButton>
  );
});
