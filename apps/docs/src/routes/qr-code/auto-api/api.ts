export const api = {
  "qr-code": [
    {
      "Qr Code Frame": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Qr Code Overlay": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Qr Code Pattern Path": {
        "types": [],
        "inheritsFrom": "path"
      }
    },
    {
      "Qr Code Pattern Svg": {
        "types": [],
        "inheritsFrom": "svg"
      }
    },
    {
      "Qr Code Root": {
        "types": [
          {
            "PublicRootProps": [
              {
                "comment": "The text value to encode in the QR code",
                "prop": "value",
                "type": "string"
              },
              {
                "comment":
                  "The error correction level of the QR code. L = Low, M = Medium, Q = Quartile, H = High",
                "prop": "level",
                "type": '"L" | "M" | "Q" | "H"'
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
      "name": "QrCode.Root"
    },
    {
      "name": "QrCode.Frame"
    },
    {
      "name": "QrCode.PatternSvg"
    },
    {
      "name": "QrCode.PatternPath"
    },
    {
      "name": "QrCode.Overlay"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Escape",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "Tab",
      "comment": "Standard focus navigation through interactive elements"
    },
    {
      "key": "Space",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "Enter",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "ArrowDown",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "ArrowUp",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "Home",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "End",
      "comment": "No keyboard interactions documented in the code"
    },
    {
      "key": "Any",
      "comment": "No keyboard interactions documented in the code"
    }
  ],
  "features": [
    "QR code generation with adjustable error correction levels",
    "Dynamic QR code updates based on value changes",
    "Customizable visual frame and overlay layers",
    "Vector-based SVG pattern rendering",
    "Accessible image role and labeling",
    "Zero-border QR code output",
    "Modular component architecture with frame, overlay, and pattern parts",
    "Path-based pattern rendering for better scaling",
    "Reactive state management for QR code updates",
    "Support for CSS styling and customization"
  ]
};
