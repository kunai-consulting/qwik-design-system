import type { Page } from "@playwright/test";

export function createTestDriver(page: Page, rootSelector = '[role="treegrid"]') {
  const getRoot = () => {
    return page.locator(rootSelector);
  };

  const getRow = (rowIndex: number) => {
    return getRoot().locator('[role="row"]').nth(rowIndex);
  };

  const getAllRows = () => {
    return getRoot().locator('[role="row"]');
  };

  const getCell = (rowIndex: number, cellIndex = 0) => {
    return getRow(rowIndex).locator('[role="gridcell"]').nth(cellIndex);
  };

  const getFocusedElementId = async () => {
    return page.evaluate(() => document.activeElement?.id);
  };

  const getFocusedRowIndex = async () => {
    const focusedId = await getFocusedElementId();
    if (!focusedId) return -1;

    const rows = await getAllRows().all();
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowId = await row.getAttribute("id");
      const hasFocusWithin =
        (await row.locator(`[role="gridcell"] #${focusedId}`).count()) > 0;

      if (rowId === focusedId || hasFocusWithin) {
        return i;
      }
    }
    return -1;
  };

  const getRowState = async (rowIndex: number) => {
    const row = getRow(rowIndex);
    const expanded = await row.getAttribute("aria-expanded");
    const selected = await row.getAttribute("aria-selected");
    const level = await row.getAttribute("aria-level");
    const disabled = await row.getAttribute("aria-disabled");
    return {
      isExpanded: expanded === "true" ? true : expanded === "false" ? false : undefined,
      isSelected: selected === "true",
      level: level ? Number.parseInt(level, 10) : undefined,
      isDisabled: disabled === "true"
    };
  };

  const focusCellInRow = async (rowIndex: number, cellIndex = 0) => {
    await getCell(rowIndex, cellIndex).focus();
  };

  return {
    page,
    getRoot,
    getRow,
    getAllRows,
    getCell,
    getFocusedElementId,
    getFocusedRowIndex,
    getRowState,
    focusCellInRow,
    keyboard: page.keyboard
  };
}

export type TreeDriver = ReturnType<typeof createTestDriver>;
