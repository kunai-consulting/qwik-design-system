export const api = {
  "otp": [
    {
      "otp-caret": []
    },
    {
      "otp-hidden-input": []
    },
    {
      "otp-item": []
    },
    {
      "otp-root": [
        {
          "PublicOtpRootProps": [
            {
              "comment": "here's a",
              "prop": "\"bind:value\"",
              "type": "Signal<string>"
            },
            {
              "comment": "here's a comment",
              "prop": "_numItems",
              "type": "number"
            },
            {
              "comment": "here's a comment",
              "prop": "autoComplete",
              "type": "HTMLInputAutocompleteAttribute"
            },
            {
              "comment": "here's a comment",
              "prop": "onComplete$",
              "type": "QRL<() => void>"
            },
            {
              "comment": "here's a comment",
              "prop": "onChange$",
              "type": "QRL<(value: string) => void>"
            },
            {
              "comment": "here's a comment",
              "prop": "value",
              "type": "string"
            },
            {
              "comment": "here's a comment",
              "prop": "disabled",
              "type": "boolean",
              "dataAttributes": [
                {
                  "name": "data-disabled",
                  "type": "string | undefined"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "anatomy": {
    "otp": [
      "Root",
      "Item",
      "HiddenInput",
      "Caret"
    ]
  }
};