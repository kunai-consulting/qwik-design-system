export const api = {
  "checklist": [
    {
      "Checklist Item": {
        "types": [
          {
            "PublicChecklistItemProps": [
              {
                "comment": "Internal prop for tracking item position in checklist",
                "prop": "_index",
                "type": "number"
              }
            ]
          }
        ]
      }
    },
    {
      "Checklist Root": {
        "types": [
          {
            "PublicChecklistRootProps": [
              {
                "comment": "Internal prop for tracking number of checklist items",
                "prop": "_numItems",
                "type": "number"
              }
            ]
          }
        ],
        "inheritsFrom": "div"
      }
    }
  ],
  "anatomy": [
    {
      "name": "Checklist.Root"
    },
    {
      "name": "Checklist.Item",
      "description": "Internal prop for tracking item position in checklist"
    },
    {
      "name": "Checklist.ItemLabel"
    },
    {
      "name": "Checklist.ItemIndicator"
    },
    {
      "name": "Checklist.ItemTrigger"
    },
    {
      "name": "Checklist.ItemDescription"
    },
    {
      "name": "Checklist.HiddenInput",
      "description": "The checklist hidden input manages multiple checkbox form inputs"
    },
    {
      "name": "Checklist.ErrorMessage"
    },
    {
      "name": "Checklist.SelectAll"
    },
    {
      "name": "Checklist.SelectAllIndicator"
    },
    {
      "name": "Checklist.Label"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Space",
      "comment": "When focus is on a checkbox trigger, toggles the checked state of that checkbox"
    },
    {
      "key": "Tab",
      "comment": "Moves focus between the checklist items in sequential order"
    },
    {
      "key": "Shift+Tab",
      "comment": "Moves focus between the checklist items in reverse order"
    },
    {
      "key": "Enter",
      "comment": "When focus is on a checkbox trigger, toggles the checked state of that checkbox"
    }
  ],
  "features": [
    "Select all items functionality",
    "Individual item selection",
    "Mixed state support when some items selected",
    "WAI ARIA Checkbox group pattern",
    "Synchronized state management across items",
    "Reactive updates between select all and individual items",
    "Form input integration",
    "Accessible labeling and descriptions",
    "Item state tracking and indexing",
    "Nested component structure support"
  ]
};