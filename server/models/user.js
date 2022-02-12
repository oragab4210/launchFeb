const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Schema = mongoose.Schema;
/* -------------------------------------------------------------------------- */

const UserSchema = new Schema({
  profilePic: String,
  email: String,
  password: String,
  name: String,
  age: Number,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",

      sparse: true,
    },
  ],

  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",

      sparse: true,
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "posts",

      sparse: true,
    },
  ],
  company: String,
});
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

/* -------------------------------------------------------------------------- */
UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
