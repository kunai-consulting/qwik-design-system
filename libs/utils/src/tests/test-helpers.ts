import type { JSXOutput } from "@builder.io/qwik";
import type { Page } from "@playwright/test";
import { cleanupAllComponents, mount } from "./mount";

interface TestSetupOptions {
  baseUrl?: string;
}

interface TestDriver {
  page: Page;
  cleanup: () => void;
}

export async function setupComponent(
  page: Page,
  component: JSXOutput,
  options: TestSetupOptions = {}
): Promise<TestDriver> {
  const { cleanup } = await mount(component, page, options);

  return {
    page,
    cleanup: () => {
      cleanup();
    }
  };
}

export function cleanupAllTests(): void {
  cleanupAllComponents();
}
