import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Anthropic } from "@anthropic-ai/sdk";
import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { AIButton } from "./ai-button";

const getExampleFiles = server$(async (route: string) => {
  const examplesPath = resolve(process.cwd(), `src/routes/${route}/examples`);
  return fs
    .readdirSync(examplesPath)
    .filter((file) => file.endsWith(".tsx") && !file.includes("-test"))
    .map((file) => file.replace(".tsx", ""));
});

const validateShowcase = (content: string, availableExamples: string[]): string => {
  const lines = content.split('\n');
  const validatedLines: string[] = [];
  let skipUntilNextHeader = false;
  let prevLevel = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const showcaseMatch = line.match(/<Showcase name="([^"]+)"/);

    if (showcaseMatch) {
      const exampleName = showcaseMatch[1];

      if (availableExamples.includes(exampleName)) {
        validatedLines.push(line);
        skipUntilNextHeader = false;
      } else {
        skipUntilNextHeader = true;
      }
    }
    else if (line.startsWith('#')) {
      const headerMatch = line.match(/^#{1,6}/);
      if (headerMatch) {
        const level = headerMatch[0].length;
        if (level > prevLevel + 1) {
          validatedLines.push('#'.repeat(prevLevel + 1) + line.slice(level));
        } else {
          validatedLines.push(line);
          prevLevel = level;
        }
      }
      skipUntilNextHeader = false;
    }

    else if (!skipUntilNextHeader && line.trim()) {
      validatedLines.push(line);
    }
  }

  return cleanEmptyLines(validatedLines.join('\n'));
};

const cleanEmptyLines = (content: string): string => {
  return content
    .split('\n')
    .reduce((acc, line, index, arr) => {
      if (line.trim() || (arr[index - 1]?.trim() && arr[index + 1]?.trim())) {
        acc.push(line);
      }
      return acc;
    }, [] as string[])
    .join('\n');
};

export const DocsAI = component$(() => {
  const isGenerating = useSignal(false);
  const status = useSignal("");
  const currentDocs = useSignal("");
  const loc = useLocation();
  const route = loc.url.pathname.split("/").filter(Boolean)[0];

  const generateInitialDocs = server$(async (promptPrefix: string) => {
    const examplesPath = resolve(process.cwd(), `src/routes/${route}/examples`);
    const exampleFiles = fs
      .readdirSync(examplesPath)
      .filter((file) => file.endsWith(".tsx") && !file.includes("-test"))
      .map((file) => file.replace(".tsx", ""));

    const heroExample = exampleFiles.includes("hero") ? "hero" : exampleFiles[0];

    const showcaseExample = `<Showcase name="${heroExample}" />\n`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          Write the title of the component as an h1.
  
          Example:
  
          # Component Name
  
          Then write a brief sentence describing the component in a way that is generic and easy to understand for 15 year olds (maximum 15 words). 
          
          Do not repeat yourself.
          
          Do not mention the words "component" or the component name in the description.
  
          This description should be directly related to what the component does. Do not write about other components or libraries.
  
          After the description, add the hero showcase component with:
  
          ${showcaseExample}
          Then add the exact text:
  
          ## Features
  
          <Features api={api} />
  
          ## Anatomy
  
          <AnatomyTable api={api} />
          
          Then write the Examples section using these rules:

          ## Examples
  
          1. Basic Usage
           - Show the simplest implementation with core props
           - ONE example demonstrating basic setup
           - Explain what each prop does
  
          2. Visual Features (if applicable)
           - Show styling and customization options
           - ONE example per visual feature
           - Group related visual features together
           - Include overlay and color customization here
  
          3. Advanced Usage (if applicable)
           - Show complex scenarios (like multiple instances)
           - ONE example per advanced feature
           - Explain unique aspects
  
          STRICT RULES:
          1. Each example MUST appear only ONCE
          2. Choose the most appropriate section for each example
          3. When a feature has multiple aspects, document them all together
          4. Do not include state management or configuration details
          5. Use backticks for component and prop names
          6. Do not create additional sections for styling or overlays
          7. Group all visual customization under Visual Features
          8. Group all advanced usage patterns under Advanced Usage
  
          This is NOT related to anything to do with the component state (initial, reactive, uncontrolled, controlled, events, disabled, etc.)
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
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the state of the component.
  
          Find and gather the examples that belong to the state section.
  
          Write an h2 with the text "Component State"
  
          From there, document state features in this order:
          1. Internal State Structure
           - Document the core state values
           - Show how state is initialized
           - Explain state relationships
      
          2. State Updates
           - Show how state changes
           - Explain update patterns
           - Document state reactions
      
          STRICT RULES:
          1. If an example was already shown in Examples section:
           - Reference it: "As shown in the Basic Usage example above..."
           - Do not show it again
           - Only add new information about state management
          2. Do not create new sections for features shown in Examples
          3. Focus on HOW state works, not on WHAT it does
          4. Use code blocks to show state implementation
          5. Do not repeat visual or configuration aspects
          6. Each feature should be documented exactly once  

          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - Configuration examples (filter, loop, etc.)
          - Behavioral examples (empty, inline, etc.)
          - Form examples (form, validation, etc.)
          - Examples you already wrote in this response
  
          For example:
  
          Initial values:
  
          Example:
  
          To set a default or initial value on page load, use the value prop on the <Accordion.Root /> component.
  
          Reactive values:
  
          Example:
  
          ### Reactive value
          
          Pass reactive state by using the bind:value prop on the <Accordion.Root /> component.
  
          <Showcase name="reactive" />
  
          Events:
  
          ### Handling selection changes
  
          <Showcase name="change" />
  
          Use the onChange$ prop to listen for changes in the selected value. It provides the new selected value as an argument.
  
          ### Disabled
  
          <Showcase name="disabled" />
  
          To disable the component, set the disabled prop to true on the <Accordion.Root /> component.
  
          You are then writing the documentation specific to the behavior of the component.
  
          Find and gather examples that are related to the behavior of the component. 
  
          Only write something if the behavioral examples exist.
  
          DO NOT write about anything that mentions or is relatively considered to be part of a component's state. (e.g. initial, reactive, disabled, etc.), this also cover's the exposed component state
  
          Do not repeat content from the previous sections!
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Configuration examples (filter, loop, etc.)
          - Form examples (form, validation, etc.)
  
          ### Empty UI
  
          By default, the popover automatically closes when there are no items to display.
  
          To show UI when there are no items in the popover, use the Combobox.Empty component.
  
          <Showcase name="empty" />
  
          ### Inline Mode (Command Palette)
  
          The Combobox supports an inline mode which allows for searching and selection from a list of options decoupled from the popover.
  
          To enable inline mode:
          - Add the mode="inline" prop to <Combobox.Root>
          - Use the Combobox.Inline component instead of <Combobox.Popover>.
  
          <Showcase name="inline" />
  
          Key Differences in Inline Mode:
          - Always Visible: The listbox remains visible at all times, even after item selection or pressing Escape
          - Initial State: The first option is automatically highlighted when the combobox renders
          - Selection Behavior:
            - Selecting an item does not close the listbox
            - The input value remains empty after selection
          - Focus Management:
            - Highlight state persists when filtering items
            - Highlight state is preserved when tabbing away and back to the input
  
          Inline mode is useful when you want users to quickly browse and select from a list while maintaining context of all available options.
  
          `
        }
      ]
    });
  });

  const generateConfigDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the configuration of the component.
  
          Write about configuration in this order:
          1. Core Configuration
           - Document essential settings and their values
           - Explain technical constraints and limitations
           - Describe default behaviors
           - ALWAYS reference examples instead of showing them again 

          2. Advanced Configuration (if applicable)
           - Document complex configuration options
           - Explain technical implications
           - Describe any limitations or constraints
           - Add new technical information not covered in Examples or State
        
          STRICT RULES:
          1. DO NOT use code blocks for examples that were shown before
          2. ALWAYS write "As shown in the X example above, ..." when referencing examples
          3. Use code blocks ONLY for:
           - New configuration options not shown in examples
           - Technical specifications
           - Type definitions
          4. DO NOT repeat information from:
           - Examples section
           - State section
           - Visual customization
          5. Focus ONLY on:
           - Technical configuration details
           - Default values and constraints
           - Performance considerations
           - Browser support requirements
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Behavioral examples (empty, inline, etc.)
          - Form examples (form, validation, etc.)
  
          Determine the h2's and h3's that should be used to organize the examples.
  
          Only write something if the configuration examples exist.
          
          Skip this section entirely if all configuration options were already covered.
  
          Below are some configuration examples from a headless Combobox component:
  
          ## Menu behavior
  
          ### Custom Filter
  
          By default, the Combobox filters items based on user input. To disable this, set the filter prop to false.
  
          <Showcase name="filter" />
  
          You can use any filtering library. In the example above, we use match-sorter.
  
          > The filter prop is true by default, using the includes method to filter items.
  
          ### Looping
  
          To loop through items, use the loop prop on <Combobox.Root />.
  
          <Showcase name="loop" />
  
          - Pressing the down arrow key moves focus to the first enabled item.
          - Pressing the up arrow key moves focus to the last enabled item.
          `
        }
      ]
    });
  });

  const generateFormDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the configuration of the component.
          
          STRICT RULES:
          1. If a feature was shown in previous sections:
           - Reference it: "As shown in the Basic Usage example above..."
           - Do not repeat the example
           - Only add form-specific information
          2. Only document form-specific features
          3. Do not repeat state or configuration details
          4. Each form feature should be documented once
          5. Group related form features together
          6. Skip this section if no form features exist
      
          Focus ONLY on:
          - Form integration
          - Form validation
          - Form submission
          - Form state handling
          
          Find and gather examples that are related to the configuration of the component. 
          
          This is NOT related to the state of the component. (e.g. initial, reactive, disabled, etc.)
  
          Only write something if the form examples exist.
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Configuration examples (filter, loop, etc.)
          - Behavioral examples (empty, inline, etc.)
  
          Below is an example of how the form section works in a headless Combobox component:
  
          ## Forms
  
          To use the combobox in a form, a visually hidden native select element is provided inside of <Combobox.HiddenNativeSelect>.
  
          <Showcase name="form" />
  
          The name prop on the Combobox.Root component is used to name the Combobox form field.
  
          ## Validation
  
          Form libaries like Modular Forms can be used to validate the combobox form field.
  
          <Showcase name="validation" />
  
          When the <Combobox.ErrorMessage> component is rendered, the component is in an invalid state.
  
          This allows you to use Qwik UI with any form validation library.`
        }
      ]
    });
  });

  const generateEnvDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the environment of the component.
          
          STRICT RULES:
          1. If a feature was shown in previous sections:
           - Reference it: "As shown in the Basic Usage example above..."
           - Do not repeat the example
           - Only add environment-specific information
          2. Only document environment-specific features
          3. Do not repeat state, configuration, or form details
          4. Each environment feature should be documented once
          5. Skip this section entirely if no environment-specific features exist
          6. Do not create sections for basic usage patterns
      
          Focus ONLY on:
          - Server vs client rendering
          - Platform-specific behavior
          - Environmental dependencies
          - Special rendering cases
  
          Find and gather examples that are related to the environment of the component. 
          
          This is NOT related to the state of the component. (e.g. initial, reactive, disabled, etc.)
  
          ONLY write something if the environmental examples exist. If they don't exist, your output should be empty.
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Configuration examples (filter, loop, etc.)
          - Form examples (form, validation, etc.)
  
          Example:
  
          ### CSR
  
          Like every Qwik UI component, the Combobox component can be rendered server-side or client-side.
  
          <Showcase name="csr" />
  
          `
        }
      ]
    });
  });

  const readFiles = server$(async (path: string) => {
    try {
      const stats = fs.statSync(path);

      if (stats.isDirectory()) {
        const files = fs.readdirSync(path);
        const contents = files
          .filter((file: string) => file.endsWith(".ts") || file.endsWith(".tsx"))
          .map((file: string) => fs.readFileSync(resolve(path, file), "utf-8"))
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
    return {
      examplesPath: resolve(process.cwd(), `src/routes/${route}/examples`),
      apiPath: resolve(process.cwd(), `src/routes/${route}/auto-api/api.ts`),
      componentPath: resolve(process.cwd(), `../../libs/components/src/${route}`)
    };
  });

  const writeLogFile = server$(async (content: string) => {
    try {
      if (!fileURLToPath) return;
      const currentFilePath = fileURLToPath(import.meta.url);
      const logPath = resolve(dirname(currentFilePath), "log.mdx");

      console.log("Writing log to:", logPath);
      fs.appendFileSync(logPath, `${content}\n\n---\n\n`, "utf-8");
      return "Log updated successfully!";
    } catch (error) {
      console.error("Error writing log:", error);
      throw new Error(
        `Failed to write log: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

  return (
    <AIButton
      onClick$={async () => {
        isGenerating.value = true;
        try {
          const paths = await getFilePaths(route);

          const exampleFiles = await getExampleFiles(route);
          status.value = "Reading component files...";
          const [formattedExamples, formattedComponents, formattedAPI] =
            await Promise.all([
              readFiles(paths.examplesPath),
              readFiles(paths.componentPath),
              readFiles(paths.apiPath)
            ]);

          const promptPrefix = `
            ${currentDocs.value !== "" ? `Documentation written for this component so far: ${currentDocs.value}` : ""}
            
            Available examples: ${exampleFiles.join(", ")}
            
            IMPORTANT: Only use examples from this list. Do not reference any examples that are not in this list.
          
            Act as a professional documentation writer for a design system that uses Qwik.

            You will be given a component implementation and examples. Each new component or example is separated by ---NEW COMPONENT--- or ---NEW EXAMPLE---.

            You will also be given an object that contains API's found.

            Component implementation:
            ${formattedComponents.split("\n\n").join("\n\n---NEW COMPONENT---\n\n")}

            Examples:
            ${formattedExamples.split("\n\n").join("\n\n---NEW EXAMPLE---\n\n")}

            API's:
            ${formattedAPI}

            When adding examples, make sure to use the <Showcase name="example-file-name" /> component.

            For each example, explain the highlighted API's that are used in the example.

            Example:
            We can select an initial uncontrolled value by passing the open prop to the <Collapsible.Root /> component.

            <Showcase name="initial" /> (initial is the file name)

            When mentioning an API or component surround it with backticks.

            Only output production ready documentation.
          `;

          // console.log("promptPrefix:", promptPrefix);

          status.value = "Generating initial documentation...";
          const initialResponse = await generateInitialDocs(promptPrefix);
          const initialDocs = validateShowcase(
            getResponseText(initialResponse),
            exampleFiles
          );
          currentDocs.value += initialDocs;

          status.value = "Generating state documentation...";
          const stateResponse = await generateStateDocs(promptPrefix);
          const stateDocs = validateShowcase(
            getResponseText(stateResponse),
            exampleFiles
          );
          currentDocs.value += stateDocs;

          status.value = "Generating config documentation...";
          const configResponse = await generateConfigDocs(promptPrefix);
          const configDocs = validateShowcase(
            getResponseText(configResponse),
            exampleFiles
          );
          currentDocs.value += configDocs;

          status.value = "Generating form documentation...";
          const formResponse = await generateFormDocs(promptPrefix);
          const formDocs = validateShowcase(getResponseText(formResponse), exampleFiles);
          currentDocs.value += formDocs;

          status.value = "Generating environment documentation...";
          const envResponse = await generateEnvDocs(promptPrefix);
          const envDocs = validateShowcase(getResponseText(envResponse), exampleFiles);
          currentDocs.value += envDocs;

          const logResults = await writeDocs(currentDocs.value, route);
          await writeLogFile(currentDocs.value);
          status.value = logResults;

          status.value = "Evaluating documentation...";

          const mdxContent = [
            'import { api } from "./auto-api/api";',
            initialDocs,
            stateDocs,
            configDocs.includes("##") ? configDocs : "",
            formDocs.includes("##") ? formDocs : "",
            // Only add the environment documentation if it exists
            envDocs.includes("##") ? envDocs : "",
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
