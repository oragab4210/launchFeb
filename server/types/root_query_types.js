const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;
const UserType = require("./user_type");
const User = require("../models/user");
const Company = require("../models/company");
const Messages = require("../models/messages");
const Posts = require("../models/posts");
const CompanyType = require("./company_type");
const MessageType = require("./message_type");
const PostType = require("./post_type");
const GraphQLObjectId = require("graphql-scalar-objectid");
/* -------------------------------------------------------------------------- */

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    /* ------------------------ all Users ------------------------ */
    users: {
      type: GraphQLList(UserType),
      resolve: async () => {
        return await User.find().populate("friends");
        // .then((res) => res.users);
      },
    },
    /* ------------------------  specific User ------------------------ */
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById({ _id: id });
      },
    },
    /* ------------------------ User using passport ------------------------ */
    user2: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      },
    },
    /* ------------------------------  Specific Company ------------------------------ */
    company: {
      type: CompanyType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Company.findOne();
      },
    },
    /* ------------------------------ All Messages ------------------------------ */
    messages: {
      type: GraphQLList(MessageType),
      args: { convoId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { convoId }) {
        return Messages.find({ convoId: convoId });
      },
    },
    /* ------------------------------ Check If Conversation Exists ------------------------------ */
    conversationExists: {
      type: MessageType,
      args: { convoId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { convoId }) {
        return Messages.findOne({ convoId: convoId });
      },
    },
    /* ------------------------------ All User Posts ------------------------------ */
    getPosts: {
      type: GraphQLList(PostType),
      args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { userId }) {
        return Posts.find({ userId: userId });
      },
    },
    /* ------------------------------ Specific Post ------------------------------ */
    getPost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLObjectId) },
        postId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, { id, postId }) {
        const res = await User.find({
          posts: { $elemMatch: { _id: postId } },
        });

        return res[0].posts.filter(
          (post) => post._id.toString() == postId.toString()
        )[0];
      },
    },
    /* -------------------------------------------------------------------------- */
  }),
});

module.exports = RootQueryType;
