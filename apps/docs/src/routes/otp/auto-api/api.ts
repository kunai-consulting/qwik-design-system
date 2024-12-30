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
              "comment": "",
              "prop": "\"bind:value\"",
              "type": "Signal<string>"
            },
            {
              "comment": "",
              "prop": "_numItems",
              "type": "number"
            },
            {
              "comment": "",
              "prop": "autoComplete",
              "type": "HTMLInputAutocompleteAttribute"
            },
            {
              "comment": "",
              "prop": "onComplete$",
              "type": "QRL<() => void>"
            },
            {
              "comment": "",
              "prop": "onChange$",
              "type": "QRL<(value: string) => void>"
            },
            {
              "comment": "",
              "prop": "value",
              "type": "string"
            },
            {
              "comment": "",
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
      "name": "Otp.Item"
    },
    {
      "name": "Otp.HiddenInput"
    },
    {
      "name": "Otp.Caret"
    }
  ]
};