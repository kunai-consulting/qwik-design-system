// import { type Page, expect, test } from "@playwright/test";
// import { createTestDriver, type TreeDriver } from "./tree.driver";

// async function setup(page: Page, exampleName = "keyboard-nav-test"): Promise<TreeDriver> {
//   await page.goto(`http://localhost:6174/base/tree/${exampleName}`);
//   const driver = createTestDriver(page);

//   await driver.getRow(0).waitFor({ state: "visible" });
//   await driver.focusCellInRow(0);

//   return driver;
// }

// test.describe("Treegrid Keyboard Navigation: Rows", () => {
//   test("ArrowDown moves focus to the next row", async ({ page }) => {
//     const d = await setup(page);

//     const focusIndexBefore = await d.getFocusedRowIndex();
//     expect(focusIndexBefore).toBe(0);

//     await d.keyboard.press("ArrowDown");
//     const focusIndexAfterFirstDown = await d.getFocusedRowIndex();
//     expect(focusIndexAfterFirstDown).toBe(focusIndexBefore + 1);

//     await d.keyboard.press("ArrowDown");
//     const focusIndexAfterSecondDown = await d.getFocusedRowIndex();
//     expect(focusIndexAfterSecondDown).toBe(focusIndexBefore + 2);
//   });

//   test("ArrowUp moves focus to the previous row", async ({ page }) => {
//     const d = await setup(page);
//     await d.focusCellInRow(2);
//     const startingFocusIndex = await d.getFocusedRowIndex();
//     expect(startingFocusIndex).toBe(2);

//     await d.keyboard.press("ArrowUp");
//     const focusIndexAfterFirstUp = await d.getFocusedRowIndex();
//     expect(focusIndexAfterFirstUp).toBe(startingFocusIndex - 1);

//     await d.keyboard.press("ArrowUp");
//     const focusIndexAfterSecondUp = await d.getFocusedRowIndex();
//     expect(focusIndexAfterSecondUp).toBe(startingFocusIndex - 2);
//   });

//   test("ArrowUp does not move focus past the first row", async ({ page }) => {
//     const d = await setup(page);
//     const focusIndexBefore = await d.getFocusedRowIndex();
//     expect(focusIndexBefore).toBe(0);

//     await d.keyboard.press("ArrowUp");
//     const focusIndexAfter = await d.getFocusedRowIndex();
//     expect(focusIndexAfter).toBe(0);
//   });

//   test("ArrowDown does not move focus past the last visible row", async ({ page }) => {
//     // This test depends heavily on the specific structure of keyboard-nav-test
//     // Assuming the test page has at least 3 rows initially visible
//     const d = await setup(page);
//     const rows = await d.getAllRows().all();
//     const lastRowIndex = rows.length - 1;

//     await d.focusCellInRow(lastRowIndex);
//     expect(await d.getFocusedRowIndex()).toBe(lastRowIndex);

//     await d.keyboard.press("ArrowDown");
//     expect(await d.getFocusedRowIndex()).toBe(lastRowIndex); // Should remain on last row
//   });

//   test("Home moves focus to the first row", async ({ page }) => {
//     const d = await setup(page);
//     await d.focusCellInRow(2);
//     expect(await d.getFocusedRowIndex()).toBe(2);

//     await d.keyboard.press("Home");
//     expect(await d.getFocusedRowIndex()).toBe(0);
//   });

//   test("End moves focus to the last visible row", async ({ page }) => {
//     // Assumes structure where last row is visible initially
//     const d = await setup(page);
//     const rows = await d.getAllRows().all();
//     const lastRowIndex = rows.length - 1;

//     await d.focusCellInRow(0);
//     expect(await d.getFocusedRowIndex()).toBe(0);

//     await d.keyboard.press("End");
//     expect(await d.getFocusedRowIndex()).toBe(lastRowIndex);
//   });

//   // Ctrl+Home/End might depend on OS or specific implementation details,
//   // skipping for base tests unless specifically needed later.
//   // test("Ctrl+Home moves focus to first row cell", async ({ page }) => { ... });
//   // test("Ctrl+End moves focus to last row cell", async ({ page }) => { ... });
// });

// test.describe("Treegrid Keyboard Navigation: Expand/Collapse", () => {
//   // These tests require specific rows to be expandable/collapsible
//   // Assuming row 0 is initially collapsed and has children
//   // Assuming row 1 is initially expanded and has children
//   // Assuming row 2 is a child of row 1

//   test("ArrowRight on a closed row expands it", async ({ page }) => {
//     const d = await setup(page);
//     await d.focusCellInRow(0);
//     const initialState = await d.getRowState(0);
//     expect(initialState.isExpanded).toBe(false); // Verify assumption

//     await d.keyboard.press("ArrowRight");
//     const finalState = await d.getRowState(0);
//     expect(finalState.isExpanded).toBe(true);
//     // Check if child row is now visible (assuming it exists)
//     await expect(d.getRow(1)).toBeVisible();
//   });

//   test("ArrowLeft on an expanded row collapses it", async ({ page }) => {
//     const d = await setup(page);
//     await d.focusCellInRow(0);
//     await d.keyboard.press("ArrowRight"); // Expand first
//     const expandedState = await d.getRowState(0);
//     expect(expandedState.isExpanded).toBe(true);

//     await d.keyboard.press("ArrowLeft"); // Collapse
//     const collapsedState = await d.getRowState(0);
//     expect(collapsedState.isExpanded).toBe(false);
//     // Check if child row is now hidden (assuming it exists)
//     await expect(d.getRow(1)).toBeHidden();
//   });

//   test("ArrowLeft on a child row moves focus to the parent row", async ({ page }) => {
//     const d = await setup(page);
//     await d.focusCellInRow(0);
//     await d.keyboard.press("ArrowRight"); // Expand row 0
//     await d.keyboard.press("ArrowDown"); // Focus child (row 1)

//     const childFocusIndex = await d.getFocusedRowIndex();
//     expect(childFocusIndex).toBe(1); // Verify focus is on child

//     await d.keyboard.press("ArrowLeft");
//     expect(await d.getFocusedRowIndex()).toBe(0); // Verify focus moved to parent
//   });

//   // Add tests for ArrowRight moving to first child if needed
//   // test("ArrowRight on an open row moves focus to first child", ...)
// });

// test.describe("Treegrid Keyboard Activation", () => {
//   // Testing Enter/Space depends highly on what the primary action is
//   // For now, let's assume Enter might toggle expansion if focus is on the trigger

//   test("Enter/Space on focusable element performs defined action", async ({ page }) => {
//     const d = await setup(page);
//     await d.focusCellInRow(0);
//     const initialState = await d.getRowState(0);
//     expect(initialState.isExpanded).toBe(false);

//     // Assuming Enter on the cell/row toggles expansion
//     await d.keyboard.press("Enter");
//     const stateAfterEnter = await d.getRowState(0);
//     expect(stateAfterEnter.isExpanded).toBe(true);

//     // Assuming Space does the same
//     await d.keyboard.press(" "); // Press Space
//     const stateAfterSpace = await d.getRowState(0);
//     expect(stateAfterSpace.isExpanded).toBe(false);
//   });
// });

// // Add describe blocks for Cell Navigation and Tab Navigation once the component
// // supports multiple cells or focusable elements within rows clearly.
// // test.describe("Treegrid Keyboard Navigation - Cells/Intra-Row", () => { ... });
