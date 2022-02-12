const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/* -------------------------------------------------------------------------- */

const MessageSchema = new Schema({
  convoId: String,
  users: Array,
  messages: Array,
});

/* -------------------------------------------------------------------------- */

const Messages = mongoose.model("messages", MessageSchema);

module.exports = Messages;
