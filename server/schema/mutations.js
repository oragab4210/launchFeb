const axios = require("axios");
const graphql = require("graphql");
const UserType = require("../types/user_type");
const User = require("../models/user");
const Company = require("../models/company");
const Messages = require("../models/messages");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const MessageType = require("../types/message_type");
const CompanyType = require("../types/company_type");
const PostType = require("../types/post_type");
const CommentType = require("../types/comment_type");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const Schema = mongoose.Schema;
const GraphQLObjectId = require("graphql-scalar-objectid");
/* -------------------------------------------------------------------------- */
const AuthService = require("../services/auth");
/* -------------------------------------------------------------------------- */

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectID,
} = graphql;

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /* --------------------------------- SignUp -------------------------------- */
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },

      resolve(parentValue, { name, email, password }, req) {
        return AuthService.signup({ name, email, password, req });
      },
    },
    /* --------------------------------- LogIn -------------------------------- */
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
      },
    },

    /* --------------------------------- LogOut -------------------------------- */
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;
        req.logout();
        return user;
      },
    },
    /* --------------------------------- addUser -------------------------------- */
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        company: { type: GraphQLString },
      },

      resolve(parentValue, { name, age, company }) {
        let user = new User({
          name,
          age,
          company,
        });
        return user.save();
      },
    },
    /* -------------------------------- editUser -------------------------------- */
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        age: { type: GraphQLInt },

        addPost: { type: GraphQLObjectId },

        deletePost: { type: GraphQLObjectId },

        addComment: { type: GraphQLObjectId },

        deleteComment: { type: GraphQLObjectId },

        addFriend: { type: GraphQLObjectId },

        deleteFriend: { type: GraphQLObjectId },

        addConversation: { type: GraphQLObjectId },
        deleteConversation: { type: GraphQLObjectId },
        profilePic: { type: GraphQLString },
      },
      async resolve(
        parentvalue,
        {
          id: id,
          email: email,
          age,
          name,
          password,
          addFriend,
          deleteFriend,
          addConversation,
          deleteConversation,
          addPost,
          deletePost,
          addComment,
          deleteComment,
          profilePic,
        }
      ) {
        if (addConversation) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $addToSet: { conversations: addConversation },
            }
          );
        } else if (deleteConversation) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $pull: { conversations: deleteConversation },
            }
          );
        } else if (addFriend) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $addToSet: { friends: addFriend },
            }
          );
        } else if (deleteFriend) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $pull: { friends: deleteFriend },
            }
          );
        } else if (addPost) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $push: { posts: addPost },
            }
          );
        } else if (deletePost) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $pull: { posts: deletePost },
            }
          );
        } else if (addComment) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $push: { comments: addComment },
            }
          );
        } else if (deleteComment) {
          return User.findOneAndUpdate(
            { _id: id },
            {
              $pull: { comments: deleteComment },
            }
          );
        } else {
          return User.findOneAndUpdate(
            { _id: id },
            { profilePic: profilePic, email: email, name: name, age: age }
          );
        }
      },
    },
    /* ------------------------------- removeUser ------------------------------- */
    removeUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, { id }) {
        return User.findByIdAndRemove(id);
      },
    },
    addCompany: {
      type: CompanyType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { name, description }) {
        let company = new Company({
          name,
          description,
        });
        return company.save();
      },
    },
    /* ------------------------------- Add Conversation ------------------------------ */
    addConversation: {
      type: MessageType,
      args: {
        convoId: { type: new GraphQLNonNull(GraphQLID) },
        messages: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parentValue, { convoId, messages }, req) {
        let newConversation = new Messages({
          convoId,
          messages,
        });
        return newConversation.save();
      },
    },
    /* ------------------------------- Edit Messages In Conversation ------------------------------ */
    editMessage: {
      type: MessageType,
      args: {
        convoId: { type: new GraphQLNonNull(GraphQLID) },

        addMessage: {
          type: new GraphQLInputObjectType({
            name: "addMessage",
            fields: {
              senderId: { type: new GraphQLNonNull(GraphQLID) },
              body: { type: GraphQLString },
            },
          }),
        },
      },
      resolve(parentValue, { convoId, addMessage }, req) {
        return Messages.findOneAndUpdate(
          { convoId: convoId },
          {
            $push: { messages: addMessage },
          }
        );
      },
    },

    /* ------------------------------- Add Post ------------------------------ */
    addPost: {
      type: PostType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        post: { type: new GraphQLNonNull(GraphQLString) },

        likes: { type: GraphQLInt },
      },
      resolve(parentValue, { userId, post, time, likes }, req) {
        let newConversation = new Posts({
          userId,
          post,

          likes: 0,
        });
        return newConversation.save();
      },
    },
    /* ------------------------------- remove Post ------------------------------- */
    removePost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, { id }) {
        return Posts.findByIdAndRemove(id);
      },
    },
    /* ------------------------------- Edit Post In Posts ------------------------------ */
    editPost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        post: { type: GraphQLString },
        addComment: { type: GraphQLObjectId },
        deleteComment: { type: GraphQLObjectId },
        addLike: { type: GraphQLObjectId },
        deleteLike: { type: GraphQLObjectId },
      },
      resolve(
        parentValue,
        { id, post, addComment, deleteComment, addLike, deleteLike },
        req
      ) {
        if (addComment) {
          return Posts.findOneAndUpdate(
            { _id: id },
            {
              $push: { comments: addComment },
            }
          );
        } else if (deleteComment) {
          return Posts.findOneAndUpdate(
            { _id: id },
            {
              $pull: { comments: deleteComment },
            }
          );
        } else if (addLike) {
          return Posts.findOneAndUpdate(
            { _id: id },
            { $addToSet: { likedBy: addLike } }
          );
        } else if (deleteLike) {
          return Posts.findOneAndUpdate(
            { _id: id },
            { $pull: { likedBy: deleteLike } }
          );
        } else {
          return Posts.findOneAndUpdate({ _id: id }, { post: post });
        }
      },
    },
    /* ------------------------------- Add Comment ------------------------------ */
    addComment: {
      type: CommentType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        time: { type: GraphQLString },
        likes: { type: GraphQLInt },
      },
      resolve(parentValue, { postId, userId, comment, time, likes }, req) {
        let newConversation = new Comments({
          postId,
          userId,
          comment,
          time,
          likes: 0,
        });
        return newConversation.save();
      },
    },
    /* ------------------------------- Delete Comment ------------------------------- */
    deleteComment: {
      type: CommentType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, { id }) {
        return Comments.findByIdAndRemove(id);
      },
    },

    /* ------------------------------- Edit Comment In Comments ------------------------------ */
    editComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: GraphQLString },
        addLike: { type: GraphQLObjectId },
        deleteLike: { type: GraphQLObjectId },
      },
      resolve(parentValue, { id, comment, addLike, deleteLike }, req) {
        if (addLike) {
          return Comments.findOneAndUpdate(
            { _id: id },
            { $addToSet: { likedBy: addLike } }
          );
        } else if (deleteLike) {
          return Comments.findOneAndUpdate(
            { _id: id },
            { $pull: { likedBy: deleteLike } }
          );
        }
        return Comments.findOneAndUpdate({ _id: id }, { comment: comment });
      },
    },
  },
});

module.exports = mutation;
