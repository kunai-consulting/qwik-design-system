export const api = {
  "toast": [
    {
      "Toast Content": {
        "types": [
          {
            "PublicContentProps": []
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-state",
            "type": "string | undefined"
          }
        ]
      }
    },
    {
      "Toast Root": {
        "types": [
          {
            "PublicRootProps": [
              {
                "comment": "",
                "prop": "position",
                "type": "ToastPosition",
                "defaultValue": "\"bottom-right\""
              },
              {
                "comment": "",
                "prop": "duration",
                "type": "number",
                "defaultValue": "5000"
              },
              {
                "comment": "",
                "prop": "open",
                "type": "boolean"
              },
              {
                "comment": "",
                "prop": "\"bind:open\"",
                "type": "Signal<boolean>"
              },
              {
                "comment": "",
                "prop": "id",
                "type": "string"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-position",
            "type": "string"
          },
          {
            "name": "data-state",
            "type": "string | undefined"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "Toast.Root"
    },
    {
      "name": "Toast.Content"
    }
  ],
  "keyboardInteractions": [],
  "features": []
};