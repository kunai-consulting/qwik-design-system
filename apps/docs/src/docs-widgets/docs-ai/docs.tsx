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

        Write a brief sentence describing the component. 

        Some examples:
        - Display and navigate through multiple content items. (Carousel)
        - A set of interactive sections that show or hide connected information. (Accordion)
        - A panel that appears above all other content, blocking interaction with the rest of the page. (Modal)

        After the description, add the hero showcase component with:

        <Showcase name="hero" />

        Then add a Features component:

        <Features />

        Followed by an Anatomy component:

        <AnatomyTable />

        
        `
      }
    ]
  });
});

const generateStateDocs = server$(async (promptPrefix: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `${promptPrefix}

        Write a brief sentence describing the component. 

        Some examples:
        - Display and navigate through multiple content items. (Carousel)
        - A set of interactive sections that show or hide connected information. (Accordion)
        - A panel that appears above all other content, blocking interaction with the rest of the page. (Modal)

        After the description, add the hero showcase component with:

        <Showcase name="hero" />

        Then add a Features component:

        <Features />

        Followed by an Anatomy component:

        <AnatomyTable />

        
        `
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
        content: `
        
        ${promptPrefix}

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
    const stats = fs.statSync(path);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(path);
      const contents = files
        .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
        .map((file) => fs.readFileSync(resolve(path, file), "utf-8"))
        .join("\n");
      return contents;
    }
    return fs.readFileSync(path, "utf-8");
  } catch (e) {
    console.warn(`Could not read from ${path}:`, e);
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

          const promptPrefix = `
            Act as a professional documentation writer for a design system that uses Qwik.

            You will be given a component implementation and examples. Each new component or example is separated by ---NEW COMPONENT--- or ---NEW EXAMPLE---.

            You will also be given an object that contains API's found.

            Component implementation:
            ${formattedComponents.split("\n\n").join("\n\n---NEW COMPONENT---\n\n")}

            Examples:
            ${formattedExamples.split("\n\n").join("\n\n---NEW EXAMPLE---\n\n")}

            API's:
            ${formattedAPI}
          `;

          console.log("promptPrefix:", promptPrefix);

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
