import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type Page, test as base, expect } from "@playwright/test";
import { createTestDriver } from "./file-upload.driver";

/**
 * Test fixtures interface for file upload testing
 * Provides typed test files for consistent file handling
 */
type TestFixtures = {
  testFiles: {
    imageFile: { path: string; name: string; type: string; size: number };
    textFile: { path: string; name: string; type: string; size: number };
  };
};

interface ProcessedFile {
  name: string;
  type: string;
  size: number;
  file?: File;
}

const test = base.extend<TestFixtures>({
  testFiles: async ({ page: _ }, use) => {
    // Create temporary test directory
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "file-upload-test-"));

    // Initialize test file contents
    const imageContent = Buffer.from("fake image content");
    const textContent = Buffer.from("fake text content");

    const imageFile = {
      path: path.join(tmpDir, "test.jpg"),
      name: "test.jpg",
      type: "image/jpeg",
      size: imageContent.length
    };

    const textFile = {
      path: path.join(tmpDir, "test.txt"),
      name: "test.txt",
      type: "text/plain",
      size: textContent.length
    };

    // Write test files to temporary directory
    await fs.promises.writeFile(imageFile.path, imageContent);
    await fs.promises.writeFile(textFile.path, textContent);

    // Provide test files to the test context
    await use({ imageFile, textFile });

    // Clean up temporary files after test completion
    await fs.promises.rm(tmpDir, { recursive: true });
  }
});

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/file-upload/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a file upload component
        WHEN initialized
        THEN all required elements should be present`, async ({ page }) => {
    const d = await setup(page, "basic-test");

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getDropzone()).toBeVisible();
    await expect(d.getInput()).toBeHidden();
    await expect(d.getTrigger()).toBeVisible();
  });

  test(`GIVEN a file upload component
      WHEN clicking the trigger button
      THEN file input should be clicked`, async ({ page }) => {
    const d = await setup(page, "basic-test");

    // Create promise that resolves on input click
    const clickPromise = d
      .getInput()
      .waitFor({ state: "attached" })
      .then(() =>
        d.getInput().evaluate(
          (input) =>
            new Promise<void>((resolve) => {
              input.addEventListener("click", () => resolve(), { once: true });
            })
        )
      );

    // Trigger file selection
    await d.getTrigger().click();

    try {
      // Wait for click with timeout
      await Promise.race([
        clickPromise,
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 1000))
      ]);
      expect(true).toBe(true); // Click successful
    } catch (error) {
      expect(error).not.toBe("timeout"); // Click failed
    }
  });
});

test.describe("drag and drop functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state before each test
    await page.reload();
  });
  test(`GIVEN a file upload dropzone
      WHEN dragging file over it
      THEN it should show dragging state`, async ({ page }) => {
    const d = await setup(page, "basic-test");

    // Ensure dropzone is ready
    await d.getDropzone().waitFor({ state: "attached" });

    await page.evaluate(() => {
      const dropzone = document.querySelector("[data-file-upload-dropzone]");

      // Initialize DragEvent with DataTransfer
      const dragEvent = new DragEvent("dragenter", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });

      // Configure DataTransfer object
      if (dragEvent.dataTransfer) {
        // Add test file to transfer
        const file = new File([""], "test.jpg", {
          type: "image/jpeg"
        });
        dragEvent.dataTransfer.items.add(file);

        // Set drag operation properties
        dragEvent.dataTransfer.effectAllowed = "all";
        dragEvent.dataTransfer.dropEffect = "copy";
      }

      // Dispatch drag event
      dropzone?.dispatchEvent(dragEvent);
    });

    // Increase timeout and add retry logic
    await expect(async () => {
      const isDragging = await d.isDragging();
      expect(isDragging).toBe(true);
    }).toPass({ timeout: 2000 });
  });

  test(`GIVEN a file upload dropzone
        WHEN dragging file out
        THEN dragging state should be removed`, async ({ page }) => {
    const d = await setup(page, "basic-test");

    // Simulate drag enter
    await page.evaluate(() => {
      const dropzone = document.querySelector("[data-file-upload-dropzone]");
      const dragEvent = new Event("dragenter", { bubbles: true });
      // @ts-ignore - Custom DataTransfer implementation
      dragEvent.dataTransfer = {
        types: ["Files"],
        items: [{ kind: "file" }],
        files: new DataTransfer().files,
        effectAllowed: "all",
        dropEffect: "copy"
      };
      dropzone?.dispatchEvent(dragEvent);
    });

    // Simulate drag leave
    await page.evaluate(() => {
      const dropzone = document.querySelector("[data-file-upload-dropzone]");
      const leaveEvent = new Event("dragleave", { bubbles: true });
      // @ts-ignore - Custom DataTransfer implementation
      leaveEvent.dataTransfer = {
        types: ["Files"],
        items: [],
        files: new DataTransfer().files,
        effectAllowed: "all",
        dropEffect: "none"
      };
      dropzone?.dispatchEvent(leaveEvent);
    });

    expect(await d.isDragging()).toBe(false);
  });

  test(`GIVEN a file upload dropzone
      WHEN dropping a file
      THEN it should process the file`, async ({ page, testFiles }) => {
    const d = await setup(page, "basic-test");

    // Ensure dropzone is ready
    await d.getDropzone().waitFor({ state: "attached" });

    let processedFiles: ProcessedFile[] = [];
    const filesProcessedPromise = new Promise<void>((resolve) => {
      page.exposeFunction("onFilesChange", (files: ProcessedFile[]) => {
        processedFiles = files;
        resolve();
      });
    });

    // Read file content for simulation
    const fileContent = await fs.promises.readFile(testFiles.imageFile.path);

    // Simulate file drop
    await page.evaluate(
      async (fileData) => {
        const dropzone = document.querySelector("[data-file-upload-dropzone]");
        if (!dropzone) throw new Error("Dropzone not found");

        // Create file content as Blob
        const blob = new Blob([Uint8Array.from(fileData.content)], {
          type: fileData.type
        });

        // Create File object
        const file = new File([blob], fileData.name, {
          type: fileData.type
        });

        // Setup DataTransfer
        const dt = new DataTransfer();
        dt.items.add(file);

        // Simulate complete drag and drop sequence
        const events = [
          new DragEvent("dragenter", {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt
          }),
          new DragEvent("dragover", {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt
          }),
          new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt
          })
        ];

        // Dispatch event sequence
        for (const event of events) {
          dropzone.dispatchEvent(event);
          // Add small delay between events
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      },
      {
        content: Array.from(fileContent),
        name: testFiles.imageFile.name,
        type: testFiles.imageFile.type
      }
    );

    // Wait for file processing with timeout
    try {
      await Promise.race([
        filesProcessedPromise,
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 2000))
      ]);
    } catch (error) {
      if (error === "timeout") {
        throw new Error("File processing timed out");
      }
      throw error;
    }

    // Verify file processing
    expect(processedFiles.length, "File should be processed after drop").toBe(1);
    expect(processedFiles[0].name).toBe(testFiles.imageFile.name);
    expect(processedFiles[0].type).toBe(testFiles.imageFile.type);
  });

  test(`GIVEN a file upload dropzone
        WHEN dragging over with invalid file type
        THEN it should not accept the file`, async ({ page }) => {
    const d = await setup(page, "image-only-test");

    // Simulate drag with invalid file type
    await page.evaluate(() => {
      const dropzone = document.querySelector("[data-file-upload-dropzone]");
      const dragEvent = new Event("dragenter", { bubbles: true });
      // @ts-ignore - Custom DataTransfer implementation
      dragEvent.dataTransfer = {
        types: ["Files"],
        items: [{ kind: "file", type: "text/plain" }],
        files: new DataTransfer().files,
        effectAllowed: "none",
        dropEffect: "none"
      };
      dropzone?.dispatchEvent(dragEvent);
    });

    // Verify file rejection
    const dropzone = d.getDropzone();
    await expect(dropzone).not.toHaveAttribute("data-dragging");
  });
});

test.describe("file handling", () => {
  test(`GIVEN a file upload component
        WHEN selecting single file
        THEN it should process the file`, async ({ page, testFiles }) => {
    const d = await setup(page, "basic-test");

    let processedFiles: ProcessedFile[] = [];

    // Setup file processing callback
    const filesProcessedPromise = new Promise<void>((resolve) => {
      page.exposeFunction("onFilesChange", (files: ProcessedFile[]) => {
        processedFiles = files;
        resolve();
      });
    });

    // Trigger file selection
    await d.getInput().setInputFiles(testFiles.imageFile.path);

    // Wait for file processing
    try {
      await Promise.race([
        filesProcessedPromise,
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 1000))
      ]);
    } catch (error) {
      if (error === "timeout") {
        throw new Error("File processing timed out");
      }
      throw error;
    }

    // Verify file processing results
    expect(processedFiles.length, "No files were processed").toBe(1);
    expect(processedFiles[0].name, "Wrong file name").toBe(testFiles.imageFile.name);
    expect(processedFiles[0].type, "Wrong file type").toBe(testFiles.imageFile.type);
    expect(processedFiles[0].size, "Wrong file size").toBe(testFiles.imageFile.size);
  });

  test(`GIVEN a file upload component
        WHEN selecting a file
        THEN change event should fire`, async ({ page, testFiles }) => {
    const d = await setup(page, "basic-test");

    // Monitor input change event
    const changePromise = d.getInput().evaluate((input) => {
      return new Promise<boolean>((resolve) => {
        input.addEventListener("change", () => resolve(true), { once: true });

        // Timeout if event doesn't fire
        setTimeout(() => resolve(false), 1000);
      });
    });

    // Trigger file selection
    await d.getInput().setInputFiles(testFiles.imageFile.path);

    // Verify change event
    const changeOccurred = await changePromise;
    expect(changeOccurred, "Change event did not fire").toBe(true);
  });

  test(`GIVEN a file upload component with multiple=true
      WHEN selecting multiple files
      THEN it should process all files`, async ({ page, testFiles }) => {
    const d = await setup(page, "multiple-test");

    let processedFiles: ProcessedFile[] = [];

    // Setup file processing callback
    const filesProcessedPromise = new Promise<void>((resolve) => {
      page.exposeFunction("onFilesChange", (files: ProcessedFile[]) => {
        processedFiles = files;
        resolve();
      });
    });

    // Select multiple files
    await d.getInput().setInputFiles([testFiles.imageFile.path, testFiles.textFile.path]);

    // Wait for file processing
    try {
      await Promise.race([
        filesProcessedPromise,
        new Promise((_, reject) => setTimeout(() => reject("timeout"), 1000))
      ]);
    } catch (error) {
      if (error === "timeout") {
        throw new Error("File processing timed out");
      }
      throw error;
    }

    // Verify multiple file processing
    expect(processedFiles.length).toBe(2);
    expect(processedFiles[0].name).toBe(testFiles.imageFile.name);
    expect(processedFiles[1].name).toBe(testFiles.textFile.name);
  });
});

test.describe("disabled state", () => {
  test(`GIVEN a disabled file upload component
      WHEN trying to interact
      THEN all interactions should be blocked`, async ({ page }) => {
    const d = await setup(page, "disabled-test");

    expect(await d.isDisabled()).toBe(true);
    await expect(d.getTrigger()).toBeDisabled();
    await expect(d.getInput()).toBeDisabled();

    // Simulate drag event in disabled state
    await page.evaluate(() => {
      const dropzone = document.querySelector("[data-file-upload-dropzone]");

      // Create DragEvent with DataTransfer
      const dragEvent = new DragEvent("dragenter", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });

      // Add test file to transfer
      if (dragEvent.dataTransfer) {
        const file = new File([""], "test.txt", {
          type: "text/plain"
        });
        dragEvent.dataTransfer.items.add(file);
      }

      // Dispatch event
      dropzone?.dispatchEvent(dragEvent);
    });

    // Verify drag is blocked
    expect(await d.isDragging()).toBe(false);
  });
});

test.describe("file type filtering", () => {
  test(`GIVEN a file upload with accept="image/*"
      WHEN selecting files
      THEN only images should be accepted`, async ({ page, testFiles }) => {
    const d = await setup(page, "image-only-test");

    const input = d.getInput();
    await expect(input).toHaveAttribute("accept", "image/*");

    let processedFiles: ProcessedFile[] = [];

    // Register file processing callback
    await page.exposeFunction("onFilesChange", (files: ProcessedFile[]) => {
      processedFiles = files;
      console.log("Files processed:", files); // Debug logging
    });

    // Verify input availability
    await expect(input).toBeAttached();

    // Log pre-upload state
    console.log("Setting input files:", testFiles.imageFile.path);

    try {
      // Upload image file
      await input.setInputFiles(testFiles.imageFile.path);

      // Allow time for processing
      await page.waitForTimeout(500);

      // Verify file selection in browser
      const filesSet = await input.evaluate((el: HTMLInputElement) => {
        return el.files?.length || 0;
      });
      console.log("Files set in input:", filesSet);

      // Verify image processing
      expect(processedFiles.length, "No files were processed").toBe(1);
      if (processedFiles.length > 0) {
        expect(processedFiles[0].type).toBe("image/jpeg");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      throw error;
    }
  });
});
