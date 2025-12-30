const SavedArticleSchema = {
  name: "SavedArticle",
  type: "object",
  properties: {
    article_id: {
      type: "string"
    },
    title: {
      type: "string"
    },
    category: {
      type: "string"
    },
    content: {
      type: "string"
    },
    image_url: {
      type: "string"
    },
    saved_date: {
      type: "string",
      format: "date"
    }
  },
  required: [
    "article_id",
    "title"
  ]
};

export default SavedArticleSchema;