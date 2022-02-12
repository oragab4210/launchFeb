const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
const Posts = require("../models/posts");

/* -------------------------------------------------------------------------- */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
    .populate({
      path: "friends",
      populate: {
        path: "posts",
        model: Posts,
        populate: {
          path: "userId",
          model: User,
        },
      },
    })
    .populate("conversations")
    .populate({
      path: "posts",
      populate: {
        path: "userId",
        model: User,
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "likedBy",
        model: User,
      },
    });
});

/* -------------------------------------------------------------------------- */
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, "Invalid Credentials");
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, "Invalid credentials.");
      });
    });
  })
);
/* -------------------------------------------------------------------------- */
function signup({ name, email, password, req }) {
  console.log("name", name);
  const user = new User({ name, email, password });
  if (!email || !password) {
    throw new Error("You must provide an email and password.-3");
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email in use-4");
      }
      return user.save();
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
    });
}
/* -------------------------------------------------------------------------- */
function login({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user) => {
      if (!user) {
        reject("Invalid credentials");
      }

      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

module.exports = { signup, login };
