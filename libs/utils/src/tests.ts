import type { JSXOutput } from "@builder.io/qwik";
import { renderToString } from "@builder.io/qwik/server";

interface RenderOptions {
  baseUrl?: string;
}

// Simple ID generator using Math.random
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// In-memory store for rendered components
const renderStore = new Map<
  string,
  {
    html: string;
    timestamp: number;
  }
>();

/**
 * Mounts a Qwik component to a unique test URL for Playwright testing
 */
export async function mount(
  component: JSXOutput,
  page: any,
  options: RenderOptions = {}
): Promise<{ uuid: string; cleanup: () => void }> {
  const uuid = generateId();
  const baseUrl = options.baseUrl || "http://localhost:6174";

  try {
    const result = await renderToString(component, {
      containerTagName: "div",
      containerAttributes: {
        "data-test-container": "true"
      }
    });

    renderStore.set(uuid, {
      html: result.html,
      timestamp: Date.now()
    });

    const url = `${baseUrl}/tests/${uuid}`;
    await page.goto(url);

    return {
      uuid,
      cleanup: () => {
        renderStore.delete(uuid);
      }
    };
  } catch (error) {
    throw new Error(`Failed to mount component: ${error}`);
  }
}

export function getMountedComponent(uuid: string): string | null {
  const stored = renderStore.get(uuid);
  return stored?.html || null;
}
