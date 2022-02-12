const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} = graphql;
const CompanyType = require("./company_type");
const MessageType = require("./message_type");
const PostType = require("./post_type");
const CompanySchema = require("../models/company");
const Posts = require("../models/posts");
const User = require("../models/user");
const Messages = require("../models/messages");
const GraphQLObjectId = require("graphql-scalar-objectid");
/* -------------------------------------------------------------------------- */
const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLObjectId },
    profilePic: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    friends: {
      type: new GraphQLList(UserType),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return User.find({ _id: parentValue.friends });
      },
    },
    conversations: {
      type: new GraphQLList(UserType),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        // console.log(parentValue.conversations);

        return User.find({ _id: parentValue.conversations });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, { first }) {
        return Posts.find({ _id: parentValue.posts });
      },
    },
  }),
});

module.exports = UserType;
