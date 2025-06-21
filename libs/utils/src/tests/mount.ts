import type { JSXOutput } from "@builder.io/qwik";
import type { Page } from "@playwright/test";

// Storage for mounted components (will be used by the route handler)
const mountedComponents = new Map<string, JSXOutput>();

// Generate unique ID for mounted components
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export async function mount(component: JSXOutput, page: Page): Promise<void> {
  const id = generateId();

  // Store the JSX component for the route handler to render
  mountedComponents.set(id, component);

  // Navigate to the test route with the component ID
  await page.goto(`http://localhost:6174/tests/${id}`);
}

export function getMountedComponent(id: string): JSXOutput | undefined {
  return mountedComponents.get(id);
}

export function cleanupAllComponents(): void {
  mountedComponents.clear();
}
