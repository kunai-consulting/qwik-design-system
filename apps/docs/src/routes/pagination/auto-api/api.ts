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
  "keyboardInteractions": [],
  "features": []
};