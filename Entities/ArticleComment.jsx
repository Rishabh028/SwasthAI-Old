const ArticleCommentSchema = {
  "name": "ArticleComment",
  "type": "object",
  "properties": {
    "article_id": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "author_name": {
      "type": "string"
    },
    "upvotes": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "article_id",
    "content"
  ]
};
export default ArticleCommentSchema;