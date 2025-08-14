/**
 * Represents a position in the pagination
 */
export interface PaginationPosition {
  page?: number;
  separator: boolean;
}

/**
 * Creates pagination positions with smart page selection and separators.
 *
 * @param currentPage - The currently active page
 * @param totalPages - Total number of pages
 * @param siblingCount - Number of pages to show on each side of current page
 * @returns Array of positions to render
 */
export function createPaginationPositions(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationPosition[] {
  // Input validation
  if (totalPages < 1) throw new Error("Total pages must be at least 1");
  if (currentPage < 1 || currentPage > totalPages) {
    throw new Error(`Current page must be between 1 and ${totalPages}`);
  }
  if (siblingCount < 0) throw new Error("Sibling count must be non-negative");

  const positions: PaginationPosition[] = [];

  // Always show first page
  positions.push({ page: 1, separator: false });

  // For small page counts, show all pages
  if (totalPages <= 2 + siblingCount * 2) {
    for (let page = 2; page <= totalPages; page++) {
      positions.push({ page, separator: false });
    }
    return positions;
  }

  // Calculate visible range around current page
  const startPage = Math.max(2, currentPage - siblingCount);
  const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

  // Add left separator if needed
  if (startPage > 2) {
    positions.push({ separator: true });
  }

  // Add pages around current
  for (let page = startPage; page <= endPage; page++) {
    positions.push({ page, separator: false });
  }

  // Add right separator if needed
  if (endPage < totalPages - 1) {
    positions.push({ separator: true });
  }

  // Always show last page (if not first)
  if (totalPages > 1) {
    positions.push({ page: totalPages, separator: false });
  }

  return positions;
}
