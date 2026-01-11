const ForumPostSchema = {
  "name": "ForumPost",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "general",
        "nutrition",
        "fitness",
        "mental-health",
        "wellness",
        "chronic-conditions",
        "preventive-care"
      ]
    },
    "upvotes": {
      "type": "number",
      "default": 0
    },
    "views": {
      "type": "number",
      "default": 0
    },
    "reply_count": {
      "type": "number",
      "default": 0
    },
    "is_pinned": {
      "type": "boolean",
      "default": false
    },
    "is_locked": {
      "type": "boolean",
      "default": false
    },
    "author_name": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "content",
    "category"
  ]
};
export default ForumPostSchema;