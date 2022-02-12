const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/* -------------------------------------------------------------------------- */

const PostSchema = new Schema({
  userId: Schema.Types.ObjectId,
  post: String,
  likedBy: Array,
  comments: Array,
  time: { type: Date, default: Date.now },
});

/* -------------------------------------------------------------------------- */

const Posts = mongoose.model("posts", PostSchema);

module.exports = Posts;
