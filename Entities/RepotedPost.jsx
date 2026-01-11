const ReportedPostSchema = {
  name: "ReportedPost",
  type: "object",
  properties: {
    post_id: {
      type: "string"
    },
    post_type: {
      type: "string",
      enum: [
        "forum_post",
        "forum_reply"
      ],
      description: "Type of content being reported"
    },
    reason: {
      type: "string",
      enum: [
        "spam",
        "harassment",
        "misinformation",
        "inappropriate",
        "other"
      ]
    },
    description: {
      type: "string"
    },
    reporter_email: {
      type: "string"
    },
    status: {
      type: "string",
      enum: [
        "pending",
        "reviewed",
        "resolved",
        "dismissed"
      ],
      default: "pending"
    }
  },
  required: [
    "post_id",
    "post_type",
    "reason",
    "reporter_email"
  ]
};
export default ReportedPostSchema;