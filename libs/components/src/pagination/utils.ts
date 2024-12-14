interface PaginationItem {
  type: 'page' | 'ellipsis';
  value?: number;
  key: string;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  siblingCount?: number;
}

export function getPaginationItems(
  totalPages: number,
  selectedPage: number,
  siblingCount = 1,
): Array<number | '...'> {
  // Input validation
  if (totalPages < 1) throw new Error('Total pages must be at least 1');
  if (siblingCount < 0) throw new Error('Sibling count must be non-negative');

  // Ensure page is within valid range
  const page = Math.min(Math.max(1, selectedPage), totalPages);
  
  const generatePaginationRange = ({
    page,
    totalPages,
    siblingCount = 1,
  }: PaginationProps): PaginationItem[] => {
    const visiblePages = new Set([1, totalPages]);
    
    // Calculate threshold points
    const minVisiblePages = 5 + (siblingCount * 2); // 1 + ellipsis + siblings + current + ellipsis + last
    
    if (totalPages <= minVisiblePages) {
      // Show all pages if total is small
      for (let i = 2; i < totalPages; i++) {
        visiblePages.add(i);
      }
    } else {
      // Calculate visible range around current page
      const leftSiblingIndex = Math.max(page - siblingCount, 2);
      const rightSiblingIndex = Math.min(page + siblingCount, totalPages - 1);

      // Add visible pages to set
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        visiblePages.add(i);
      }
    }

    // Convert set to sorted array with ellipsis
    return Array.from(visiblePages)
      .sort((a, b) => a - b)
      .reduce<PaginationItem[]>((items, pageNum, idx, array) => {
        if (idx > 0 && pageNum - array[idx - 1] > 1) {
          items.push({ type: 'ellipsis', key: `ellipsis-${items.length}` });
        }
        items.push({ type: 'page', value: pageNum, key: `page-${pageNum}` });
        return items;
      }, []);
  };

  return generatePaginationRange({ page, totalPages, siblingCount })
    .map(item => item.type === 'page' ? item.value! : '...');
}