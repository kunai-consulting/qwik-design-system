export const api = {
  "checklist": [
    {
      "Checklist Error Message": {
        "types": []
      }
    },
    {
      "Checklist Hidden Input": {
        "types": []
      }
    },
    {
      "Checklist Item Description": {
        "types": []
      }
    },
    {
      "Checklist Item Indicator": {
        "types": []
      }
    },
    {
      "Checklist Item Label": {
        "types": []
      }
    },
    {
      "Checklist Item Trigger": {
        "types": []
      }
    },
    {
      "Checklist Item": {
        "types": []
      }
    },
    {
      "Checklist Label": {
        "types": []
      }
    },
    {
      "Checklist Root": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Checklist Select All Indicator": {
        "types": []
      }
    },
    {
      "Checklist Select All": {
        "types": []
      }
    }
  ],
  "anatomy": [
    {
      "name": "Checklist.Root"
    },
    {
      "name": "Checklist.Item"
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
      "comment": "When focus is on a checkbox trigger, toggles the checked state"
    },
    {
      "key": "Enter",
      "comment": "When focus is on a checkbox trigger, toggles the checked state"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to the next focusable checkbox trigger or item"
    },
    {
      "key": "Shift+Tab",
      "comment": "Moves focus to the previous focusable checkbox trigger or item"
    }
  ],
  "features": [
    "Select all items functionality",
    "Individual item selection",
    "Mixed state handling (indeterminate)",
    "Form input integration",
    "Group role accessibility",
    "Synchronized state management between items",
    "Nested checkbox hierarchy",
    "Custom item descriptions",
    "Error message support",
    "Dynamic item indexing"
  ]
};
