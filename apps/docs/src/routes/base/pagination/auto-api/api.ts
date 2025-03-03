export const api = {
  "pagination": [
    {
      "Pagination Ellipsis": {
        "inheritsFrom": "div"
      }
    },
    {
      "Pagination Next": {
        "inheritsFrom": "button"
      }
    },
    {
      "Pagination Page": {
        "types": [
          {
            "PublicAllowedElements": []
          },
          {
            "PublicPaginationPageProps": [
              {
                "comment": "Internal index of the page item",
                "prop": "_index",
                "type": "number"
              },
              {
                "comment": "Whether this page item is disabled",
                "prop": "isDisabled",
                "type": "boolean"
              },
              {
                "comment": "",
                "prop": "as",
                "type": "C"
              }
            ]
          }
        ],
        "dataAttributes": [
          {
            "name": "data-index",
            "type": "string",
            "comment": "Specifies the index of the pagination page"
          },
          {
            "name": "data-current",
            "type": "string",
            "comment": "Indicates if this is the currently selected page"
          }
        ]
      }
    },
    {
      "Pagination Previous": {
        "inheritsFrom": "button"
      }
    },
    {
      "Pagination Root": {
        "types": [
          {
            "PublicPaginationRootProps": [
              {
                "comment": "The total number of pages to display",
                "prop": "totalPages",
                "type": "number"
              },
              {
                "comment": "The initial page number to display when component loads",
                "prop": "currentPage",
                "type": "number"
              },
              {
                "comment": "Reactive value that can be controlled via signal. Sets the current active page number",
                "prop": "\"bind:page\"",
                "type": "Signal<number | 1>"
              },
              {
                "comment": "Event handler for page change events",
                "prop": "onPageChange$",
                "type": "QRL<(page: number) => void>"
              },
              {
                "comment": "Whether the pagination component is disabled",
                "prop": "disabled",
                "type": "boolean"
              },
              {
                "comment": "Array of page numbers to display",
                "prop": "pages",
                "type": "number[]"
              },
              {
                "comment": "Custom element to display for ellipsis",
                "prop": "ellipsis",
                "type": "JSXChildren"
              },
              {
                "comment": "Number of siblings to show on each side of current page",
                "prop": "siblingCount",
                "type": "number"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined",
            "comment": "Indicates whether the pagination component is disabled"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "Pagination.Root",
      "description": "Root pagination container component that provides context and handles page management"
    },
    {
      "name": "Pagination.Page",
      "description": "Individual page number button component"
    },
    {
      "name": "Pagination.Next",
      "description": "Next page navigation button component"
    },
    {
      "name": "Pagination.Previous",
      "description": "Previous page navigation button component"
    },
    {
      "name": "Pagination.Ellipsis",
      "description": "Renders an ellipsis item in the pagination"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "ArrowRight",
      "comment": "When focus is on a pagination page, moves focus to the next page"
    },
    {
      "key": "ArrowLeft",
      "comment": "When focus is on a pagination page, moves focus to the previous page"
    },
    {
      "key": "Home",
      "comment": "When focus is on a pagination page, moves focus to the first page"
    },
    {
      "key": "End",
      "comment": "When focus is on a pagination page, moves focus to the last page"
    },
    {
      "key": "Enter",
      "comment": "When focus is on a pagination page, selects that page"
    },
    {
      "key": "Space",
      "comment": "When focus is on a pagination page, selects that page"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to the next focusable element in the pagination component"
    }
  ],
  "features": [
    "Dynamic page range calculation with sibling pages",
    "Smart ellipsis placement for large page counts",
    "Keyboard navigation with arrow keys and Home/End",
    "Aria-compliant pagination controls",
    "Bound signal synchronization for page changes",
    "First/Last page quick navigation",
    "Disabled state handling for boundary pages",
    "Customizable ellipsis display",
    "Controlled and uncontrolled page state",
    "Page change event handling"
  ]
};