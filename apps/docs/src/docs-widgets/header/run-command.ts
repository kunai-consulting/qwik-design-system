import { exec } from "node:child_process";
import { promisify } from "node:util";
import { server$ } from "@qwik.dev/router";

// Convert exec to promise-based
const execPromise = promisify(exec);

export const runCommand = server$(
  async (
    command: string
  ): Promise<{ success: boolean; output?: string; error?: string }> => {
    try {
      const { stdout, stderr } = await execPromise(command);
      if (stderr) {
        console.error(`Error: ${stderr}`);
        return { success: false, error: stderr };
      }
      return { success: true, output: stdout };
    } catch (error) {
      console.error(`Exception: ${error}`);
      return { success: false, error: String(error) };
    }
  }
);
