import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { Anthropic } from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { AIButton } from "./ai-button";

const generateInitialDocs = server$(async (promptPrefix: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `${promptPrefix}

        Write documentation that:
        1. Start with a practical description focused on what users can do with it
           Example: "A checkbox lets users select or deselect an option."
           - Use simple, direct language
           - One line only
           - Focus on the core action users can take
        
        2. Preview section with <Showcase name="hero" />
        
        3. Building blocks section with basic implementation
        
        4. For each usage pattern:
           - Write a brief, practical explanation focused on user needs
           - Add <Showcase name="[example-file-name]" /> using the actual example file names
           - No code blocks (they're handled by the Showcase component)
        
        5. Group patterns from basic to advanced
        
        6. Add keyboard interactions at the end if applicable

        Focus on what users can do with the component rather than technical descriptions.`
      }
    ]
  });
});

const evaluateDocs = server$(async (promptPrefix: string, initialDocs: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${promptPrefix}

        Documentation to review:
        ${initialDocs}

        Check for:
        1. Simple, direct language in descriptions
           - One line for component description
           - Focus on core user actions
           - No marketing terms like "versatile" or "powerful"
        
        2. Proper showcase components:
           - <Showcase name="hero" /> for preview
           - <Showcase name="[example-file-name]" /> using actual file names
           - No code blocks
        
        3. Brief, practical explanations for each pattern
        4. Logical progression from basic to advanced patterns
        
        Provide specific improvement suggestions.`
      }
    ]
  });
});

const finalizeDocs = server$(
  async (promptPrefix: string, initialDocs: string, feedback: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}

        Original docs:
        ${initialDocs}

        Editor feedback:
        ${feedback}

        Requirements:
        1. Keep language simple and direct
        2. Focus on user actions and practical usage
        3. Use proper showcase components
        4. Brief explanations for each pattern
        5. No code blocks`
        }
      ]
    });
  }
);

const readFiles = server$(async (path: string) => {
  try {
    const files = fs.readdirSync(path);
    return files
      .map((file) => {
        const content = fs.readFileSync(resolve(path, file), "utf-8");
        return `// ${file}\n${content}`;
      })
      .join("\n\n");
  } catch (e) {
    console.warn(`Could not read files from ${path}:`, e);
    return "";
  }
});

const writeDocs = server$(async (mdxContent: string, route: string) => {
  try {
    const docsPath = resolve(process.cwd(), `src/routes/${route}/index.mdx`);
    fs.writeFileSync(docsPath, mdxContent);
    return "Documentation updated successfully!";
  } catch (error) {
    console.error("Error writing docs:", error);
    throw new Error(
      `Failed to write documentation: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
});

const getFilePaths = server$(async (route: string) => {
  const { resolve } = await import("node:path");
  return {
    examplesPath: resolve(process.cwd(), `src/routes/${route}/examples`),
    apiPath: resolve(process.cwd(), `src/routes/${route}/auto-api/api.ts`),
    componentPath: resolve(process.cwd(), `../../libs/components/src/${route}`)
  };
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
        try {
          const paths = await getFilePaths(route);

          status.value = "Reading component files...";
          const [formattedExamples, formattedComponents, formattedAPI] =
            await Promise.all([
              readFiles(paths.examplesPath),
              readFiles(paths.componentPath),
              readFiles(paths.apiPath)
            ]);

          console.log("Found examples:", formattedExamples);
          console.log("formattedComponents:", formattedComponents);
          console.log("formattedAPI:", formattedAPI);

          const promptPrefix = `
            Act as a professional documentation writer for a design system that uses Qwik.

            You will be given a component implementation and examples.

            You will also be given an object that contains API's found.

            Component implementation:
            ${formattedComponents}

            Examples:
            ${formattedExamples}

            API's:
            ${formattedAPI}
          `;

          status.value = "Generating initial documentation...";
          const initialResponse = await generateInitialDocs(promptPrefix);
          const initialDocs = getResponseText(initialResponse);

          status.value = "Evaluating documentation...";
          const evaluationResponse = await evaluateDocs(promptPrefix, initialDocs);
          const feedback = getResponseText(evaluationResponse);

          status.value = "Finalizing documentation...";
          const finalResponse = await finalizeDocs(promptPrefix, initialDocs, feedback);

          const mdxContent = [
            'import { api } from "./auto-api/api";',
            getResponseText(finalResponse),
            "## Anatomy\n\n<AnatomyTable />",
            "<APITable api={api} />"
          ].join("\n\n");

          status.value = "Saving documentation...";
          const result = await writeDocs(mdxContent, route);
          status.value = result;
        } catch (error) {
          console.error("Error generating docs:", error);
          status.value = `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`;
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

const getResponseText = (response: Anthropic.Messages.Message) => {
  const content = response.content[0];
  return content?.type === "text" ? content.text : "";
};
