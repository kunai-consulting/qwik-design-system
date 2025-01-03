import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { Anthropic } from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { AIButton } from "./ai-button";

const generateDocs = server$(async (route: string) => {
  try {
    console.log("Starting docs generation for route:", route);

    // Validate API key first
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    // Consolidated file reading and formatting
    const readAndFormatFiles = (
      path: string,
      filter = (f: string) => f.endsWith(".tsx")
    ) => {
      if (!fs.existsSync(path)) {
        throw new Error(`No folder found at ${path}`);
      }

      return fs
        .readdirSync(path)
        .filter(filter)
        .map((file) => ({
          name: file,
          content: fs.readFileSync(resolve(path, file), "utf-8")
        }))
        .map(({ name, content }) => `=== ${name} ===\n${content}\n`)
        .join("\n");
    };

    const examplesPath = resolve(process.cwd(), `src/routes/${route}/examples`);
    const componentPath = resolve(process.cwd(), `../../libs/components/src/${route}`);

    const formattedExamples = readAndFormatFiles(examplesPath);
    const formattedComponents = readAndFormatFiles(componentPath);

    console.log("Found examples:", formattedExamples);
    console.log("formattedComponents:", formattedComponents);

    const docsPath = resolve(process.cwd(), `src/routes/${route}/index.mdx`);
    let existingDocs = "";
    try {
      existingDocs = fs.readFileSync(docsPath, "utf-8");
      console.log("Found existing docs");
    } catch (e) {
      console.log("No existing docs found");
    }

    const updates = [];

    // 1. overview
    const introResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `ONLY OUTPUT PRODUCTION WRITING. NOTHING TO DO WITH THE PROMPT.
          
          Analyze this checkbox component implementation and write a minimal introduction.
            Component implementation:
            ${formattedComponents}

            Examples:
            ${formattedExamples}

            Required format:

            # Component name

            [One-line description that a 15 year old can understand of what the component is and how it relates to ui development]

            Example:

            Checkbox

            A control that enables users to make binary (or ternary) choices through selection and deselection.

            Next is the hero example.

            <Showcase name="hero" />

            Rules:
            - Description must be based on the actual code
            - Focus on the component's core form control purpose
            - Keep existing code blocks if present
            - Document how to build with this headless component, NOT how the headless component is built
            `
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
            Component implementation:
            ${formattedComponents}

            Examples:
            ${formattedExamples}

            Required section:
            ## Component State

            Analyze the examples and group them based on their core state management patterns.

            Rules:
            - One clear sentence per example
            - Use note blocks for important details: > Detail here (1 per example max)
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
        Component implementation:
        ${formattedComponents}

        Examples:
        ${formattedExamples}

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

    const getResponseText = (response: Anthropic.Messages.Message) => {
      const content = response.content[0];
      return content?.type === "text" ? content.text : "";
    };

    const mdxContent = [
      'import { api } from "./auto-api/api";',
      getResponseText(introResponse),
      `## Anatomy
      
       <AnatomyTable />
      `,
      getResponseText(stateResponse),
      getResponseText(additionalResponse),
      "<APITable api={api} />"
    ]
      .filter(Boolean)
      .join("\n\n");

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
