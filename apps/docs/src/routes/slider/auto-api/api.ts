export const api = {
  "slider": [
    {
      "Slider Range": {
        "inheritsFrom": "div"
      }
    },
    {
      "Slider Root": {
        "types": [
          {
            "PublicRootProps": []
          }
        ],
        "inheritsFrom": "div"
      }
    },
    {
      "Slider Thumb": {
        "dataAttributes": [
          {
            "name": "data-thumb-type",
            "type": "string | undefined"
          }
        ]
      }
    },
    {
      "Slider Tooltip": {
        "dataAttributes": [
          {
            "name": "data-placement",
            "type": "string"
          }
        ]
      }
    },
    {
      "Slider Track": {
        "inheritsFrom": "div"
      }
    }
  ],
  "anatomy": [
    {
      "name": "Slider.Root"
    },
    {
      "name": "Slider.Track"
    },
    {
      "name": "Slider.Range"
    },
    {
      "name": "Slider.Thumb"
    },
    {
      "name": "Slider.Marks"
    },
    {
      "name": "Slider.Tooltip"
    }
  ],
  "keyboardInteractions": [],
  "features": []
};