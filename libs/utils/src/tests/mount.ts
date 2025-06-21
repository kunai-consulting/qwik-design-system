import type { JSXOutput } from "@builder.io/qwik";
import { renderToString } from "@builder.io/qwik/server";

interface RenderOptions {
  baseUrl?: string;
}

// Simple UUID generator using Math.random
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
 * @param component - The JSX component to mount
 * @param page - The Playwright page instance
 * @param options - Mount options
 * @returns Promise with UUID and cleanup function
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

    // Store the mounted HTML with timestamp
    renderStore.set(uuid, {
      html: result.html,
      timestamp: Date.now()
    });

    const url = `${baseUrl}/tests/${uuid}`;

    // Navigate to the test URL automatically
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

/**
 * Get mounted component HTML by UUID
 */
export function getMountedComponent(uuid: string): string | null {
  const stored = renderStore.get(uuid);
  return stored?.html || null;
}

/**
 * Clean up all stored components (useful for test teardown)
 */
export function cleanupAllComponents(): void {
  renderStore.clear();
}

/**
 * Get all stored component UUIDs (useful for debugging)
 */
export function getStoredComponentUUIDs(): string[] {
  return Array.from(renderStore.keys());
}
