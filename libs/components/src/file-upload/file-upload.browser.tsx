import { component$ } from "@qwik.dev/core";
import { page, userEvent } from "@vitest/browser/context";
import { beforeEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-qwik";
import { FileUpload } from "..";
import type { FileInfo } from "./file-upload-context";
import type { PublicFileUploadProps } from "./file-upload-root";

declare global {
  interface Window {
    onFilesChange?: (files: FileInfo[]) => void;
    __processedFiles?: FileInfo[];
  }
}

beforeEach(() => {
  window.__processedFiles = [];
  window.onFilesChange = undefined;
});

const Root = page.getByTestId("root");
const Dropzone = page.getByTestId("dropzone");
const Input = page.getByTestId("input");
const Trigger = page.getByTestId("trigger");

const Basic = component$((props: PublicFileUploadProps) => {
  return (
    <FileUpload.Root
      data-testid="root"
      onChange$={(files) => {
        window.onFilesChange?.(files);
        window.__processedFiles = files;
        // @ts-ignore - for tests
        window.hasChangeEventFired = "yes";
      }}
      {...props}
    >
      <FileUpload.HiddenInput data-testid="input" />
      <FileUpload.Dropzone data-testid="dropzone">
        <p>Drag and drop files here or</p>
        <FileUpload.Trigger data-testid="trigger">Browse Files</FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
});

function makeFile(name: string, type: string, content: string | Uint8Array) {
  const blob =
    content instanceof Uint8Array
      ? new Blob([content], { type })
      : new Blob([content], { type });
  return new File([blob], name, { type });
}

async function waitForProcessedFiles(expectedCount = 1, timeoutMs = 2000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const files = window.__processedFiles;
    if (Array.isArray(files) && files.length === expectedCount) {
      return files;
    }
    await new Promise((r) => setTimeout(r, 25));
  }
  throw new Error("File processing timed out");
}

test("should render required elements", async () => {
  render(<Basic />);

  await expect.element(Root).toBeVisible();
  await expect.element(Dropzone).toBeVisible();
  await expect.element(Input).toBeInTheDocument();
  await expect.element(Trigger).toBeVisible();
});

test("trigger should call showPicker when available", async () => {
  render(<Basic />);

  await expect.element(Input).toBeInTheDocument();
  await expect.element(Input).toBeVisible();

  const inputEl = (await Input.element()) as HTMLInputElement | null;
  if (!inputEl) throw new Error("input not found");

  const showPickerSpy = vi.fn().mockResolvedValue(undefined);
  inputEl.showPicker = showPickerSpy;

  await expect.element(Trigger).toBeVisible();

  await userEvent.click(Trigger);

  expect(showPickerSpy).toHaveBeenCalledTimes(1);
});

test("dragging over dropzone should set dragging state", async () => {
  render(<Basic />);

  await expect.element(Dropzone).toBeVisible();
  const dz = (await Dropzone.element()) as HTMLDivElement | null;
  if (!dz) throw new Error("dropzone not found");

  const dt = new DataTransfer();
  const file = makeFile("test.jpg", "image/jpeg", new Uint8Array([1, 2, 3]));
  dt.items.add(file);
  const dragEvent = new DragEvent("dragenter", {
    bubbles: true,
    cancelable: true,
    dataTransfer: dt
  });
  dz.dispatchEvent(dragEvent);

  await expect.element(Dropzone).toHaveAttribute("data-dragging");
});

test("drag leave should remove dragging state", async () => {
  render(<Basic />);

  await expect.element(Dropzone).toBeVisible();
  const dz = (await Dropzone.element()) as HTMLDivElement | null;
  if (!dz) throw new Error("dropzone not found");

  const enterEvent = new Event("dragenter", { bubbles: true }) as unknown as {
    dataTransfer: unknown;
  };

  (enterEvent as { dataTransfer: unknown }).dataTransfer = {
    types: ["Files"],
    items: [{ kind: "file" }],
    files: new DataTransfer().files,
    effectAllowed: "all",
    dropEffect: "copy"
  } as unknown;

  dz.dispatchEvent(enterEvent as unknown as Event);

  await expect.element(Dropzone).toHaveAttribute("data-dragging");

  const leaveEvent = new Event("dragleave", { bubbles: true }) as unknown as {
    dataTransfer: unknown;
  };

  (leaveEvent as { dataTransfer: unknown }).dataTransfer = {
    types: ["Files"],
    items: [],
    files: new DataTransfer().files,
    effectAllowed: "all",
    dropEffect: "none"
  } as unknown;
  dz.dispatchEvent(leaveEvent as unknown as Event);

  await expect.element(Dropzone).toBeVisible();

  await expect.element(Dropzone).not.toHaveAttribute("data-dragging");
});

test("dropping a file should process it", async () => {
  render(<Basic />);

  const dz = (await Dropzone.element()) as HTMLDivElement | null;
  if (!dz) throw new Error("dropzone not found");

  const file = makeFile("test.jpg", "image/jpeg", new Uint8Array([1, 2, 3]));
  const dt = new DataTransfer();
  dt.items.add(file);

  const events = [
    new DragEvent("dragenter", { bubbles: true, cancelable: true, dataTransfer: dt }),
    new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt }),
    new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: dt })
  ];

  for (const e of events) dz.dispatchEvent(e);

  const files = await waitForProcessedFiles(1, 2000);
  expect(files.length).toBe(1);
  expect(files[0].name).toBe("test.jpg");
  expect(files[0].type).toBe("image/jpeg");
});

test("invalid file type should not be accepted on drag", async () => {
  render(<Basic accept="image/*" />);

  await expect.element(Root).toBeVisible();
  await expect.element(Dropzone).toBeVisible();
  const dz = (await Dropzone.element()) as HTMLDivElement | null;
  if (!dz) throw new Error("dropzone not found");

  const dragEvent = new Event("dragenter", { bubbles: true }) as unknown as DragEvent & {
    dataTransfer: unknown;
  };
  (dragEvent as { dataTransfer: unknown }).dataTransfer = {
    types: ["Files"],
    items: [{ kind: "file", type: "text/plain" }],
    files: new DataTransfer().files,
    effectAllowed: "none",
    dropEffect: "none"
  } as unknown;
  dz.dispatchEvent(dragEvent as unknown as Event);

  await expect.element(Dropzone).not.toHaveAttribute("data-dragging");
});

// file handling

test("selecting single file should process it", async () => {
  render(<Basic />);

  const inputEl = (await Input.element()) as HTMLInputElement | null;
  if (!inputEl) throw new Error("input not found");

  await userEvent.upload(
    inputEl,
    makeFile("test.jpg", "image/jpeg", "fake image content")
  );

  const files = await waitForProcessedFiles(1, 2000);
  expect(files.length).toBe(1);
  expect(files[0].name).toBe("test.jpg");
  expect(files[0].type).toBe("image/jpeg");
});

test("selecting a file should fire change event", async () => {
  render(<Basic />);

  await expect.element(Input).toBeVisible();

  await expect.element(Input).toBeInTheDocument();

  await userEvent.upload(Input, makeFile("test.jpg", "image/jpeg", "fake image content"));

  await expect.element(Input).toBeVisible();
  await expect.element(Input).toBeInTheDocument();

  // @ts-ignore - for tests
  await expect(window.hasChangeEventFired).toBe("yes");
});

test("multiple=true should process multiple files", async () => {
  render(<Basic multiple />);

  await expect.element(Root).toBeVisible();
  const inputEl = (await Input.element()) as HTMLInputElement | null;
  if (!inputEl) throw new Error("input not found");

  await userEvent.upload(inputEl, [
    makeFile("test.jpg", "image/jpeg", "fake image content"),
    makeFile("test.txt", "text/plain", "fake text content")
  ]);

  const files = await waitForProcessedFiles(2, 2000);
  expect(files.length).toBe(2);
  expect(files[0].name).toBe("test.jpg");
  expect(files[1].name).toBe("test.txt");
});

// disabled state

test("disabled file upload should block interactions", async () => {
  render(<Basic disabled />);

  await expect.element(Root).toHaveAttribute("data-disabled");
  await expect.element(Trigger).toBeDisabled();
  await expect.element(Input).toBeDisabled();

  const dz = (await Dropzone.element()) as HTMLDivElement | null;
  if (!dz) throw new Error("dropzone not found");

  const dragEvent = new DragEvent("dragenter", {
    bubbles: true,
    cancelable: true,
    dataTransfer: new DataTransfer()
  });
  const file = makeFile("test.txt", "text/plain", "x");
  dragEvent.dataTransfer?.items.add(file);
  dz.dispatchEvent(dragEvent);

  await expect.element(Dropzone).not.toHaveAttribute("data-dragging");
});

// file type filtering

test('accept="image/*" should filter file types', async () => {
  render(<Basic accept="image/*" />);

  await expect.element(Input).toHaveAttribute("accept", "image/*");

  const inputEl = (await Input.element()) as HTMLInputElement | null;
  if (!inputEl) throw new Error("input not found");

  await userEvent.upload(
    inputEl,
    makeFile("test.jpg", "image/jpeg", "fake image content")
  );

  const files = await waitForProcessedFiles(1, 2000);
  expect(files.length).toBe(1);
  expect(files[0].type).toBe("image/jpeg");
});
