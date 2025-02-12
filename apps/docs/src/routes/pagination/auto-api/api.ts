export const api = {
  "pagination": [
    {
      "Pagination Ellipsis": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Pagination Next": {
        "types": [],
        "inheritsFrom": "button"
      }
    },
    {
      "Pagination Page": {
        "types": [],
        "dataAttributes": [
          {
            "name": "data-index",
            "type": "string"
          },
          {
            "name": "data-current",
            "type": "string"
          }
        ]
      }
    },
    {
      "Pagination Previous": {
        "types": [],
        "inheritsFrom": "button"
      }
    },
    {
      "Pagination Root": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "Pagination.Root"
    },
    {
      "name": "Pagination.Page"
    },
    {
      "name": "Pagination.Next"
    },
    {
      "name": "Pagination.Previous"
    },
    {
      "name": "Pagination.Ellipsis"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "ArrowRight",
      "comment": "When focus is on a page number, moves focus to the next page number"
    },
    {
      "key": "ArrowLeft",
      "comment": "When focus is on a page number, moves focus to the previous page number"
    },
    {
      "key": "Home",
      "comment": "When focus is on a page number, moves focus to the first page number"
    },
    {
      "key": "End",
      "comment": "When focus is on a page number, moves focus to the last page number"
    },
    {
      "key": "Enter",
      "comment": "When focus is on a page number, selects that page"
    },
    {
      "key": "Space",
      "comment": "When focus is on a page number, selects that page"
    }
  ],
  "features": [
    "WAI ARIA compliant pagination navigation",
    "Dynamic page range calculation with ellipsis",
    "Configurable sibling count around current page",
    "Keyboard navigation with arrow keys, Home and End",
    "First/Last page quick navigation",
    "Controlled and uncontrolled page state management",
    "Disabled state support",
    "Custom page change event handling",
    "Automatic focus management",
    "Responsive pagination layout"
  ]
};
