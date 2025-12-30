const PostUpvoteSchema = {
  "name": "PostUpvote",
  "type": "object",
  "properties": {
    "post_id": {
      "type": "string"
    },
    "user_email": {
      "type": "string"
    }
  },
  "required": [
    "post_id",
    "user_email"
  ]
};
export default PostUpvoteSchema;