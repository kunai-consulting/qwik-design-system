export const api = {
  "otp": [
    {
      "Otp Caret": []
    },
    {
      "Otp Hidden Input": []
    },
    {
      "Otp Item": [],
      "dataAttributes": [
        {
          "name": "data-highlighted",
          "type": "string | undefined"
        },
        {
          "name": "data-disabled",
          "type": "string | undefined"
        }
      ]
    },
    {
      "Otp Root": [
        {
          "PublicOtpRootProps": [
            {
              "comment": "Reactive value that can be controlled via signal. Describe what passing their signal does for this bind property",
              "prop": "\"bind:value\"",
              "type": "Signal<string>"
            },
            {
              "comment": "Number of OTP input items to display",
              "prop": "_numItems",
              "type": "number"
            },
            {
              "comment": "HTML autocomplete attribute for the input",
              "prop": "autoComplete",
              "type": "HTMLInputAutocompleteAttribute"
            },
            {
              "comment": "Event handler for when all OTP items are filled",
              "prop": "onComplete$",
              "type": "QRL<() => void>"
            },
            {
              "comment": "Event handler for when the OTP value changes",
              "prop": "onChange$",
              "type": "QRL<(value: string) => void>"
            },
            {
              "comment": "Initial value of the OTP input",
              "prop": "value",
              "type": "string"
            },
            {
              "comment": "Whether the OTP input is disabled",
              "prop": "disabled",
              "type": "boolean",
              "defaultValue": "false"
            }
          ]
        }
      ],
      "dataAttributes": [
        {
          "name": "data-disabled",
          "type": "string | undefined"
        }
      ]
    }
  ],
  "anatomy": [
    {
      "name": "Otp.Root",
      "description": "Here's a comment for you!"
    },
    {
      "name": "Otp.Item",
      "description": "Individual item component for displaying a single OTP digit"
    },
    {
      "name": "Otp.HiddenInput",
      "description": "Hidden input component that handles OTP input interactions and validation"
    },
    {
      "name": "Otp.Caret",
      "description": "Component that renders a caret for OTP input focus indication"
    }
  ]
};