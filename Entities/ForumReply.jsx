const SavedArticleSchema = {
  "name": "ForumReply",
  "type": "object",
  "properties": {
    "post_id": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "upvotes": {
      "type": "number",
      "default": 0
    },
    "author_name": {
      "type": "string"
    },
    "is_helpful": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "post_id",
    "content"
  ]
};
export default SavedArticleSchema;