// Quick test of the simplified function
const pages = [1, 4, 5, 6, 20];
console.log("Input pages:", pages);

// This is what the function should do:
const items = [];
const sortedPages = [...pages].sort((a, b) => a - b);
const uniquePages = [...new Set(sortedPages)];

for (let i = 0; i < uniquePages.length; i++) {
  const currentPage = uniquePages[i];
  const prevPage = uniquePages[i - 1];

  // Add separator if there's a gap
  if (i > 0 && currentPage - prevPage > 1) {
    items.push({ type: "separator", key: `separator-${items.length}` });
  }

  // Add the page
  items.push({ type: "page", page: currentPage, key: `page-${currentPage}` });
}

console.log(
  "Output:",
  items.map((item) => (item.type === "page" ? item.page : "..."))
);
// Should output: [1, "...", 4, 5, 6, "...", 20]
