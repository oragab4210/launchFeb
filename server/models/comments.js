const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/* -------------------------------------------------------------------------- */

const CommentSchema = new Schema({
  postId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  comment: String,
  likedBy: Array,
  time: { type: Date, default: Date.now },
});

/* -------------------------------------------------------------------------- */

const Comments = mongoose.model("comments", CommentSchema);

module.exports = Comments;
