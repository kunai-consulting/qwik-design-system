export const api = {
  "file-upload": [
    {
      "File Upload Dropzone": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-file-upload-dropzone",
            "type": "string"
          },
          {
            "name": "data-dragging",
            "type": "string | undefined"
          },
          {
            "name": "data-disabled",
            "type": "string | undefined"
          }
        ]
      }
    },
    {
      "File Upload Input": {
        "types": [],
        "inheritsFrom": "input",
        "dataAttributes": [
          {
            "name": "data-file-upload-input",
            "type": "string"
          }
        ]
      }
    },
    {
      "File Upload Root": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-file-upload-root",
            "type": "string"
          },
          {
            "name": "data-disabled",
            "type": "string | undefined"
          }
        ]
      }
    },
    {
      "File Upload Trigger": {
        "types": [],
        "inheritsFrom": "button",
        "dataAttributes": [
          {
            "name": "data-file-upload-trigger",
            "type": "string"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "File-upload.Root",
      "description": "Root component for file upload functionality\n  Provides context and state management for child components"
    },
    {
      "name": "File-upload.Dropzone"
    },
    {
      "name": "File-upload.Input",
      "description": "Hidden file input component that handles file selection via system dialog"
    },
    {
      "name": "File-upload.Trigger",
      "description": "Trigger component that opens the file selection dialog\n  Acts as a styled button that triggers the hidden file input"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Space",
      "comment": "When focus is on the trigger button, opens the native file selection dialog"
    },
    {
      "key": "Enter",
      "comment": "When focus is on the trigger button, opens the native file selection dialog"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to and from the trigger button following the normal tab order"
    }
  ],
  "features": [
    "Drag and drop file upload support",
    "Multiple file selection option",
    "File type filtering and validation",
    "Visual drag state indicators",
    "Custom trigger button for file selection",
    "Progressive file processing",
    "Native file dialog integration",
    "Disabled state handling",
    "File change notifications",
    "Cross-browser drag and drop compatibility",
    "Prevents default browser file handling",
    "Custom drop zone styling"
  ]
};